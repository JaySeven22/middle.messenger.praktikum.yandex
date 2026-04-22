import type Block from "../framework/block";

export function render(query: string, block: Block): Element {
    const root = document.querySelector(query);

    if (!root) {
        throw new Error(`Root element not found: ${query}`);
    }

    const content = block.element();

    if (!content) {
        throw new Error("Block root element was not created");
    }

    root.innerHTML = "";
    root.append(content);

    return root;
}
