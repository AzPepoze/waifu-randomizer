function fileExtension(url: string): string {
	const match = new URL(url).pathname.match(/\.(\w+)$/);
	return match?.[1] ?? "png";
}

function saveFile(href: string, filename: string): void {
	const link = document.createElement("a");
	link.href = href;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	link.remove();
}

export async function downloadImage(url: string): Promise<void> {
	try {
		const response = await fetch(url);
		if (!response.ok) throw new Error("Fetch failed");

		const blobUrl = URL.createObjectURL(await response.blob());
		saveFile(blobUrl, `waifu-${Date.now()}.${fileExtension(url)}`);
		URL.revokeObjectURL(blobUrl);
	} catch (error) {
		console.error("Direct download failed, falling back to new tab:", error);
		window.open(url, "_blank");
	}
}

export async function copyLink(url: string): Promise<boolean> {
	try {
		await navigator.clipboard.writeText(url);
		return true;
	} catch {
		return false;
	}
}
