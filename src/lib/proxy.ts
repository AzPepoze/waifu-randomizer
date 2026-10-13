const PROXY_URL = "https://proxy.azpepoze.com/";
const KONACHAN_URL = "https://konachan.net";
const LOCAL_KONACHAN_PATH = "/konachan";
const LOCAL_HOSTS = ["localhost", "127.0.0.1"];

function isLocalServer(): boolean {
	return LOCAL_HOSTS.includes(window.location.hostname);
}

export function wrapWithProxy(url: string): string {
	if (!url) return "";
	if (isLocalServer()) return url.replace(KONACHAN_URL, LOCAL_KONACHAN_PATH);
	return `${PROXY_URL}?url=${encodeURIComponent(url)}`;
}
