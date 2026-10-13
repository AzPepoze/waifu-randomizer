// Resolves once the image is loaded and cached, so it can be shown at once
export function preloadImage(url: string): Promise<string> {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.onload = () => resolve(url);
		image.onerror = () => reject(new Error("Failed to load image"));
		image.src = url;
	});
}
