import {
	InitialConfigType,
	LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import {
	HEADING,
	QUOTE,
	UNORDERED_LIST,
	ORDERED_LIST,
	BOLD_ITALIC_STAR,
	BOLD_STAR,
	ITALIC_STAR,
	STRIKETHROUGH,
	LINK,
} from "@lexical/markdown";

import TreeViewPlugin from "./plugins/TreeViewPlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";

import theme from "./theme";
import { $getRoot, $getSelection, EditorState } from "lexical";
import VariablesPlugin from "./plugins/VariablesPlugin";
import VariableNode from "./nodes/VariableNode";

function Placeholder() {
	return <div className="editor-placeholder">Enter some rich text...</div>;
}

const editorConfig: InitialConfigType = {
	namespace: "MyEditor",
	// The editor theme
	theme,
	// Handling of errors during update
	onError(error) {
		throw error;
	},
	// Any custom nodes go here
	nodes: [
		HeadingNode,
		ListNode,
		ListItemNode,
		QuoteNode,
		AutoLinkNode,
		LinkNode,
		VariableNode,
	],
};

export default function Editor() {
	const onChange = (editorState: EditorState) => {
		editorState.read(() => {
			// Read the contents of the EditorState here.
			const root = $getRoot();
			const selection = $getSelection();
		});
	};
	return (
		<LexicalComposer initialConfig={editorConfig}>
			<div className="editor-container">
				<ToolbarPlugin />
				<div className="editor-inner">
					<RichTextPlugin
						contentEditable={<ContentEditable className="editor-input" />}
						placeholder={<Placeholder />}
						ErrorBoundary={LexicalErrorBoundary}
					/>
					<MarkdownShortcutPlugin
						transformers={[
							HEADING,
							QUOTE,
							UNORDERED_LIST,
							ORDERED_LIST,
							BOLD_ITALIC_STAR,
							BOLD_STAR,
							ITALIC_STAR,
							STRIKETHROUGH,
							LINK,
						]}
					/>
					<OnChangePlugin onChange={onChange} />
					<TreeViewPlugin />
					<AutoFocusPlugin />
					<ListPlugin />
					<LinkPlugin />
					<VariablesPlugin />
				</div>
			</div>
		</LexicalComposer>
	);
}
