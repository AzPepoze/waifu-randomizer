import { error } from '@sveltejs/kit';

export async function GET({ url }) {
	const imageUrl = url.searchParams.get('url');

	if (!imageUrl) {
		throw error(400, 'Missing url parameter');
	}

	try {
		const response = await fetch(imageUrl);

		if (!response.ok) {
			throw error(response.status, `Failed to fetch image: ${response.statusText}`);
		}

		const blob = await response.blob();
		const contentType = response.headers.get('content-type') || 'application/octet-stream';

		const filename = imageUrl.split('/').pop().split('?')[0] || `waifu-${Date.now()}`;
		const extension = filename.includes('.') ? '' : '.png';

		return new Response(blob, {
			headers: {
				'Content-Type': contentType,
				'Content-Disposition': `attachment; filename="${filename}${extension}"`,
				'Cache-Control': 'public, max-age=3600'
			}
		});
	} catch (e) {
		console.error('Download proxy error:', e);
		throw error(500, 'Internal Server Error while downloading image');
	}
}
