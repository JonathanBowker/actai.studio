import { randomBytes, createHmac } from "node:crypto";
import { promises as dns } from "node:dns";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import type { APIRoute } from "astro";

export const prerender = false;

const CONTACT_EMAIL = "hello@actai.studio";
const env = import.meta.env;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const MIN_SUBMIT_MS = 2_000;
const ALLOWED_STARTING_POINTS = new Set(["Something to make", "Something to work", "Something to Make", "Something to Work", "Agent in the Room", "AI direction", "Agent diagnostic", "Agent delivery", "Not sure yet", "Something else"]);
const PERSONAL_EMAIL_DOMAINS = new Set([
	"aol.com", "btinternet.com", "fastmail.com", "gmail.com", "googlemail.com", "hey.com", "hotmail.co.uk", "hotmail.com",
	"icloud.com", "live.co.uk", "live.com", "mail.com", "me.com", "msn.com", "outlook.co.uk", "outlook.com", "proton.me",
	"protonmail.com", "yahoo.co.uk", "yahoo.com", "ymail.com",
]);
const rateLimitSalt = randomBytes(32);
const requestCounts = new Map<string, { count: number; resetAt: number }>();
let rateLimitChecks = 0;
if (env.AWS_PROFILE && !process.env.AWS_PROFILE) process.env.AWS_PROFILE = env.AWS_PROFILE;
const ses = new SESv2Client({
	region: env.AWS_SES_REGION || process.env.AWS_SES_REGION || process.env.AWS_REGION || "eu-west-2",
	maxAttempts: 3,
});

const envValue = (name: string) => env[name] || process.env[name] || "";

const json = (body: Record<string, unknown>, status = 200, headers: HeadersInit = {}) =>
	new Response(JSON.stringify(body), {
		status,
		headers: {
			"cache-control": "no-store",
			"content-type": "application/json; charset=utf-8",
			...headers,
		},
	});

const textField = (formData: FormData, name: string, maxLength: number) => {
	const value = formData.get(name);
	return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
};

const clientKey = (request: Request) => {
	const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
	const address = request.headers.get("cf-connecting-ip") || forwardedFor || request.headers.get("x-real-ip") || "unknown";
	return createHmac("sha256", rateLimitSalt).update(address).digest("hex");
};

const clientAddress = (request: Request) =>
	request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "";

const validateBusinessEmail = async (email: string) => {
	const domain = email.split("@").at(-1)?.toLowerCase() || "";
	if (!domain || PERSONAL_EMAIL_DOMAINS.has(domain)) return { valid: false, error: "business_email_required" };

	try {
		const records = await dns.resolveMx(domain);
		return records.length > 0 ? { valid: true } : { valid: false, error: "email_mx_lookup_failed" };
	} catch {
		return { valid: false, error: "email_mx_lookup_failed" };
	}
};

const verifyTurnstile = async (token: string, remoteIp: string) => {
	const secret = envValue("TURNSTILE_SECRET_KEY");
	if (!secret) return true;
	if (!token) return false;

	try {
		const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ secret, response: token, remoteip: remoteIp || undefined }),
		});
		const result = await response.json() as { success?: boolean };
		return response.ok && result.success === true;
	} catch {
		return false;
	}
};

const isRateLimited = (request: Request) => {
	const now = Date.now();
	rateLimitChecks += 1;
	if (rateLimitChecks % 100 === 0) {
		for (const [key, value] of requestCounts) {
			if (value.resetAt <= now) requestCounts.delete(key);
		}
	}

	const key = clientKey(request);
	const current = requestCounts.get(key);

	if (!current || current.resetAt <= now) {
		requestCounts.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
		return false;
	}

	current.count += 1;
	return current.count > RATE_LIMIT_MAX_REQUESTS;
};

const isSameOrigin = (request: Request) => {
	const origin = request.headers.get("origin");
	if (!origin) return true;

	try {
		const hostname = new URL(origin).hostname;
		return hostname === "actai.studio" || hostname === "www.actai.studio" || hostname === "localhost" || hostname.endsWith(".ondigitalocean.app");
	} catch {
		return false;
	}
};

export const POST = (async ({ request }) => {
	if (!isSameOrigin(request)) {
		return json({ ok: false, message: "We could not send your note.", contactEmail: CONTACT_EMAIL }, 403);
	}

	let formData: FormData;
	try {
		formData = await request.formData();
	} catch {
		return json({ ok: false, message: "Please check the form and try again.", contactEmail: CONTACT_EMAIL }, 400);
	}

	if (textField(formData, "website", 200)) {
		return json({ ok: true, message: "Thank you. Your note has been sent." });
	}

	if (isRateLimited(request)) {
		return json(
			{ ok: false, error: "rate_limited", message: "Too many attempts. Please wait 15 minutes or email us directly.", contactEmail: CONTACT_EMAIL },
			429,
			{ "retry-after": "900" },
		);
	}

	const submission = {
		name: textField(formData, "name", 120),
		role: textField(formData, "role", 120),
		company: textField(formData, "company", 160),
		email: textField(formData, "email", 254),
		startingPoint: textField(formData, "starting-point", 80),
		details: textField(formData, "details", 5000),
	};
	const startedAt = Number(textField(formData, "_started_at", 30));
	const turnstileToken = textField(formData, "_turnstile_token", 4096);
	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	if (
		Object.values(submission).some((value) => !value) ||
		!emailPattern.test(submission.email) ||
		!ALLOWED_STARTING_POINTS.has(submission.startingPoint)
	) {
		return json({ ok: false, error: "invalid_email", message: "Please complete every field with a valid work email.", contactEmail: CONTACT_EMAIL }, 400);
	}

	if (!Number.isFinite(startedAt) || Date.now() - startedAt < MIN_SUBMIT_MS) {
		return json({ ok: false, error: "submitted_too_fast", message: "Please take a moment to complete the form.", contactEmail: CONTACT_EMAIL }, 400);
	}

	const emailValidation = await validateBusinessEmail(submission.email);
	if (!emailValidation.valid) {
		const message = emailValidation.error === "business_email_required"
			? "Please use a business email address."
			: "Please use a work email domain with valid mail server records.";
		return json({ ok: false, error: emailValidation.error, message, contactEmail: CONTACT_EMAIL }, 400);
	}

	if (!(await verifyTurnstile(turnstileToken, clientAddress(request)))) {
		return json({ ok: false, error: "turnstile_failed", message: "Please retry the form verification and send again.", contactEmail: CONTACT_EMAIL }, 400);
	}

	const from = envValue("CONTACT_EMAIL_FROM") || envValue("LEAD_EMAIL_FROM");
	const to = envValue("CONTACT_EMAIL_TO") || envValue("LEAD_EMAIL_TO");

	if (!from || !to) {
		return json({ ok: false, message: "Email delivery is temporarily unavailable.", contactEmail: CONTACT_EMAIL }, 503);
	}

	const emailBody = [
		"New Act AI Studio enquiry",
		"",
		`Name: ${submission.name}`,
		`Job title: ${submission.role}`,
		`Company: ${submission.company}`,
		`Work email: ${submission.email}`,
		`Enquiry type: ${submission.startingPoint}`,
		"",
		"Details:",
		submission.details,
	].join("\n");

	try {
		const result = await ses.send(
			new SendEmailCommand({
				FromEmailAddress: from,
				Destination: { ToAddresses: [to] },
				ReplyToAddresses: [submission.email],
				Content: {
					Simple: {
						Subject: { Data: `Act AI Studio enquiry: ${submission.startingPoint}`, Charset: "UTF-8" },
						Body: { Text: { Data: emailBody, Charset: "UTF-8" } },
					},
				},
			}),
		);

		if (!result.MessageId) throw new Error("SES did not confirm the message");
		return json({ ok: true, message: "Thank you. Your note has been sent." });
	} catch {
		return json({ ok: false, message: "We could not send your note.", contactEmail: CONTACT_EMAIL }, 424);
	}
}) satisfies APIRoute;
