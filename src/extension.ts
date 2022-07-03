// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import * as path from "path";
import {
	languages,
	workspace,
	EventEmitter,
	ExtensionContext,
	window,
	commands,
	ViewColumn,
	WebviewPanel,
	WorkspaceEdit,
	Selection,
	Uri,
	InlayHintsProvider,
	TextDocument,
	CancellationToken,
	Range,
	InlayHint,
	TextDocumentChangeEvent,
	Position,
	InlayHintLabelPart,
	Location,
	ProviderResult,
} from "vscode";

import {
	Disposable,
	Executable,
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind,
} from "vscode-languageclient/node";


let client: LanguageClient;
// type a = Parameters<>;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const traceOutputChannel = window.createOutputChannel("Fe Language Server trace");
	const command = process.env.SERVER_PATH || "fe";
	const run: Executable = {
		command,
		args: ["lsp"],
		options: {
			env: {
				...process.env,
				// eslint-disable-next-line @typescript-eslint/naming-convention
				RUST_LOG: "debug",
			},
		},
	};
	const serverOptions: ServerOptions = {
		run,
		debug: run
	};
	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	// Options to control the language client
	let clientOptions: LanguageClientOptions = {
		// Register the server for plain text documents
		documentSelector: [{ scheme: "file", language: "fe-lang" }],
		synchronize: {
			// Notify the server about file changes to '.clientrc files contained in the workspace
			fileEvents: workspace.createFileSystemWatcher("**/.clientrc"),
		},
		traceOutputChannel,
	};

	// Create the language client and start the client.
	client = new LanguageClient("fe-language-server", "Fe language server", serverOptions, clientOptions);
	client.start();
}

// this method is called when your extension is deactivated
export function deactivate() {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
