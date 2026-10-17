type TurnstileApi = {
	render: (container: HTMLElement, options: Record<string, unknown>) => string;
	reset: (widgetId: string) => void;
	execute: (widgetId: string) => void;
};

declare global {
	interface Window { turnstile?: TurnstileApi }
}

const widgets = new WeakMap<HTMLFormElement, string>();
const startedAt = new WeakMap<HTMLFormElement, number>();
const pending = new WeakMap<HTMLFormElement, (token: string) => void>();
let scriptPromise: Promise<void> | null = null;

const loadTurnstile = () => {
	if (window.turnstile) return Promise.resolve();
	if (scriptPromise) return scriptPromise;

	scriptPromise = new Promise((resolve) => {
		const existing = document.querySelector<HTMLScriptElement>('script[src*="challenges.cloudflare.com/turnstile"]');
		if (existing) {
			existing.addEventListener("load", () => resolve(), { once: true });
			existing.addEventListener("error", () => resolve(), { once: true });
			return;
		}

		const script = document.createElement("script");
		script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
		script.async = true;
		script.defer = true;
		script.addEventListener("load", () => resolve(), { once: true });
		script.addEventListener("error", () => resolve(), { once: true });
		document.head.append(script);
	});

	return scriptPromise;
};

const getTurnstileToken = async (form: HTMLFormElement) => {
	const siteKey = form.dataset.turnstileSiteKey?.trim();
	if (!siteKey) return "";

	await loadTurnstile();
	if (!window.turnstile) return "";

	return new Promise<string>((resolve) => {
		let settled = false;
		const finish = (token = "") => {
			if (settled) return;
			settled = true;
			pending.delete(form);
			resolve(token);
		};
		pending.set(form, finish);
		window.setTimeout(() => finish(), 12_000);

		let widgetId = widgets.get(form);
		if (!widgetId) {
			const container = document.createElement("div");
			container.hidden = true;
			container.setAttribute("aria-hidden", "true");
			form.append(container);
			widgetId = window.turnstile?.render(container, {
				sitekey: siteKey,
				size: "invisible",
				execution: "execute",
				callback: (token: string) => pending.get(form)?.(token || ""),
				"error-callback": () => pending.get(form)?.(""),
				"expired-callback": () => pending.get(form)?.(""),
			});
			if (widgetId) widgets.set(form, widgetId);
		} else {
			try { window.turnstile?.reset(widgetId); } catch {}
		}

		if (!widgetId) return finish();
		try { window.turnstile?.execute(widgetId); } catch { finish(); }
	});
};

export const initialiseProtectedForm = (form: HTMLFormElement | null | undefined) => {
	if (form && !startedAt.has(form)) startedAt.set(form, Date.now());
};

export const getProtectedFormData = async (form: HTMLFormElement) => {
	initialiseProtectedForm(form);
	const formData = new FormData(form);
	formData.set("_started_at", String(startedAt.get(form) || Date.now()));
	formData.set("_turnstile_token", await getTurnstileToken(form));
	return formData;
};

export const resetProtectedForm = (form: HTMLFormElement) => {
	startedAt.set(form, Date.now());
	const widgetId = widgets.get(form);
	if (widgetId) {
		try { window.turnstile?.reset(widgetId); } catch {}
	}
};

export const getProtectionErrorMessage = (result: Record<string, unknown>, fallback: string) => {
	switch (result.error) {
		case "business_email_required": return "Please use a business email address.";
		case "email_mx_lookup_failed": return "Please use a work email domain with valid mail server records.";
		case "turnstile_failed": return "Please retry the form verification and send again.";
		case "submitted_too_fast": return "Please take a moment to complete the form.";
		case "rate_limited": return "Please wait before sending another enquiry.";
		default: return typeof result.message === "string" ? result.message : fallback;
	}
};
