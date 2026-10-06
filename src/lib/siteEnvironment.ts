const productionHosts = new Set(["actai.studio", "www.actai.studio"]);

export const isReviewStaging = (url: URL) => {
	const hostname = url.hostname.toLowerCase();
	if (productionHosts.has(hostname)) return false;

	return import.meta.env.PUBLIC_SITE_ENV === "staging" || hostname.endsWith(".ondigitalocean.app");
};
