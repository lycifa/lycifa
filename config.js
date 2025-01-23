require.config({
    paths: {
        'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.38.0/min/vs'
    }
});

require(['vs/editor/editor.main'], function () {
    // Monaco Editor Theme Configuration
    monaco.editor.defineTheme('net-theme-dark', {
        base: 'vs-dark',
        inherit: true,
        colors: {
            "editor.background": '#141414',
        },
        rules: [
            { token: 'global', foreground: '6699cc', fontStyle: "bold" },
            { token: 'keyword', foreground: 'cc99cc', fontStyle: "bold" },
            { token: 'comment', foreground: '999999' },
            { token: 'number', foreground: 'f99157' },
            { token: 'string', foreground: '99CC99' },
            { token: 'Method', foreground: 'ffa1dc' },
        ]
    });

    // Monaco Editor Setup
    const editor = monaco.editor.create(document.getElementById('container'), {
        language: 'lua',
        theme: 'net-theme-dark',
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: true,
        wordBasedSuggestions: true,
        suggestOnTriggerCharacters: true,
        showFoldingControls: 'always',
        minimap: { enabled: false },
        smoothScrolling: true,
        fontLigatures: true,
        formatOnPaste: true,
        padding: { top: 24 },
    });

    // Handle Editor Resizing
    window.onresize = () => editor.layout();
});
