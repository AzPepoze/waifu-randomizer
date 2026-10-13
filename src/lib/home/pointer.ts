export function followPointer(element: HTMLElement): () => void {
	function onMove(event: PointerEvent) {
		element.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
	}

	window.addEventListener("pointermove", onMove);
	return () => window.removeEventListener("pointermove", onMove);
}

interface ClickHandlers {
	onPress: (x: number, y: number) => void;
	onRelease: () => void;
}

export function watchClicks({ onPress, onRelease }: ClickHandlers): () => void {
	function handlePress(event: PointerEvent) {
		onPress(event.clientX, event.clientY);
	}

	window.addEventListener("pointerdown", handlePress);
	window.addEventListener("pointerup", onRelease);
	return () => {
		window.removeEventListener("pointerdown", handlePress);
		window.removeEventListener("pointerup", onRelease);
	};
}
