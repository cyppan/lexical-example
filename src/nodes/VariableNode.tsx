import {
	DOMConversionMap,
	DOMExportOutput,
	DecoratorNode,
	EditorConfig,
	LexicalEditor,
	LexicalNode,
	NodeKey,
	SerializedLexicalNode,
} from "lexical";
import { ReactNode, useContext } from "react";
import { VariablesContext } from "../VariablesContext";

function VariableTag({ value }: { value: string }) {
	const availablesVariables = useContext(VariablesContext);
	const variableName = availablesVariables.find(
		(variable) => variable.value === value
	)?.name;
	return (
		<span
			style={{
				background: variableName ? "lime" : "red",
				border: "1px solid grey",
				borderRadius: 5,
				padding: 2,
			}}
		>
			{variableName ?? "Unavailable variable"}
		</span>
	);
}

export default class VariableNode extends DecoratorNode<any> {
	__value: string;

	static getType(): string {
		return "variable";
	}

	static clone(node: VariableNode): VariableNode {
		return new VariableNode(node.__value, node.__key);
	}

	constructor(value: string, key?: NodeKey) {
		super(key);
		this.__value = value;
	}

	createDOM(_config: EditorConfig, _editor: LexicalEditor): HTMLElement {
		return document.createElement("span");
	}

	updateDOM(): false {
		return false;
	}

	decorate(editor: LexicalEditor, config: EditorConfig): ReactNode {
		return <VariableTag value={this.__value} />;
	}

	isInline(): boolean {
		return true;
	}

	isKeyboardSelectable() {
		return false;
	}

	exportJSON(): SerializedLexicalNode & { value: string; isValid: boolean } {
		return {
			type: "variable",
			version: 1,
			value: this.__value,
			isValid: this.__isValid,
		};
	}

	static importJSON<
		T extends SerializedLexicalNode & { value: string; isValid: boolean }
	>(serializedNode: T): LexicalNode {
		const { value, isValid } = serializedNode;
		return $createVariableNode(value);
	}

	exportDOM(editor: LexicalEditor): DOMExportOutput {
		const span = document.createElement("span");
		span.innerHTML = this.__value;
		return { element: span };
	}

	getTextContent(): string {
		return this.__value;
	}

	static importDOM(): DOMConversionMap | null {
		return {
			span: () => ({
				conversion: (el) => ({ node: $createVariableNode(el.innerText) }),
				priority: 0,
			}),
		};
	}
}

export function $createVariableNode(value: string): VariableNode {
	return new VariableNode(value);
}

export function $isVariableNode(
	node: LexicalNode | null | undefined
): node is VariableNode {
	return node instanceof VariableNode;
}
