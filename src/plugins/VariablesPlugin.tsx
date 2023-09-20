import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
	$createParagraphNode,
	$insertNodes,
	$isRootOrShadowRoot,
	COMMAND_PRIORITY_EDITOR,
	LexicalCommand,
	LexicalEditor,
	TextNode,
	createCommand,
} from "lexical";
import { $wrapNodeInElement } from "@lexical/utils";
import VariableNode, { $createVariableNode } from "../nodes/VariableNode";
import { useEffect } from "react";

const VARIABLE_REGEX = /\{\{([^{}]*)\}\}/;

function transformVariables(textNode_: TextNode) {
	let textNode = textNode_;
	const match = textNode.getTextContent().match(VARIABLE_REGEX);
	if (!match) {
		return;
	}
	const startIndex = match.index || 0;
	const endIndex = startIndex + match[0].length;
	let replaceNode, _leftTextNode, rightTextNode;
	if (startIndex === 0) {
		[replaceNode, textNode] = textNode.splitText(endIndex);
	} else {
		[_leftTextNode, replaceNode, rightTextNode] = textNode.splitText(
			startIndex,
			endIndex
		);
	}
	const [, value] = match;
	replaceNode.replace($createVariableNode(value));
	if (rightTextNode) {
		transformVariables(rightTextNode);
	}
}

export const INSERT_VARIABLE_COMMAND: LexicalCommand<{
	value: string;
}> = createCommand("INSERT_EQUATION_COMMAND");

function useVariables(editor: LexicalEditor) {
	useEffect(() => {
		if (!editor.hasNodes([VariableNode])) {
			throw new Error("VariablesPlugin: VariableNode not registered on editor");
		}
		const removeTransform = editor.registerNodeTransform(TextNode, (node) => {
			transformVariables(node);
		});
		const removeCommand = editor.registerCommand<{
			value: string;
		}>(
			INSERT_VARIABLE_COMMAND,
			(payload) => {
				const { value } = payload;
				const node = $createVariableNode(value);

				$insertNodes([node]);
				if ($isRootOrShadowRoot(node.getParentOrThrow())) {
					$wrapNodeInElement(node, $createParagraphNode).selectEnd();
				}

				return true;
			},
			COMMAND_PRIORITY_EDITOR
		);
		return () => {
			removeTransform();
			removeCommand();
		};
	}, [editor]);
}

export default function VariablesPlugin() {
	const [editor] = useLexicalComposerContext();
	useVariables(editor);
	return null;
}
