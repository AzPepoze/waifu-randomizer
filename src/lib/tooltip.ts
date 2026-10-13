const FLIP_BELOW_TOP = 64;

let tip: HTMLDivElement | undefined;
let owner: HTMLElement | undefined;

function ensureTip(host: HTMLElement): HTMLDivElement {
	if (!tip) {
		tip = document.createElement("div");
		tip.className = "tooltip-float glass";
		tip.setAttribute("role", "tooltip");
	}
	if (tip.parentElement !== host) host.appendChild(tip);
	return tip;
}

function hideTip(): void {
	tip?.classList.remove("is-visible");
	owner = undefined;
}

export function tooltip(node: HTMLElement, text: string) {
	let label = text;

	function showTip(): void {
		if (!label) return;

		const host = node.closest<HTMLElement>(".glass-page") ?? document.body;
		const element = ensureTip(host);
		const rect = node.getBoundingClientRect();
		const below = rect.top < FLIP_BELOW_TOP;

		owner = node;
		element.textContent = label;
		element.classList.toggle("below", below);
		element.style.left = `${rect.left + rect.width / 2}px`;
		element.style.top = `${below ? rect.bottom : rect.top}px`;
		element.classList.add("is-visible");
	}

	function showOnKeyboardFocus(): void {
		if (node.matches(":focus-visible")) showTip();
	}

	node.addEventListener("pointerenter", showTip);
	node.addEventListener("pointerleave", hideTip);
	node.addEventListener("pointerdown", hideTip);
	node.addEventListener("click", hideTip);
	node.addEventListener("focus", showOnKeyboardFocus);
	node.addEventListener("blur", hideTip);

	return {
		update(next: string) {
			label = next;
			if (owner === node && tip) tip.textContent = next;
		},
		destroy() {
			node.removeEventListener("pointerenter", showTip);
			node.removeEventListener("pointerleave", hideTip);
			node.removeEventListener("pointerdown", hideTip);
			node.removeEventListener("click", hideTip);
			node.removeEventListener("focus", showOnKeyboardFocus);
			node.removeEventListener("blur", hideTip);
			hideTip();
		},
	};
}
