let observer: IntersectionObserver | undefined;

function onIntersect(entries: IntersectionObserverEntry[]) {
	for (const entry of entries) {
		if (!entry.isIntersecting) continue;
		entry.target.classList.add("is-visible");
		observer?.unobserve(entry.target);
	}
}

// Svelte action: adds `is-visible` once the element scrolls into view
export function reveal(node: HTMLElement) {
	observer ??= new IntersectionObserver(onIntersect, { threshold: 0.3 });
	observer.observe(node);

	return {
		destroy() {
			observer?.unobserve(node);
		},
	};
}
