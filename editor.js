let tabs = [];
let currentTab = null;

// Save tabs to local storage
function saveTabs() {
    localStorage.setItem('tabs', JSON.stringify(tabs));
}

// Load tabs from local storage
function loadTabs() {
    const savedTabs = JSON.parse(localStorage.getItem('tabs')) || [];
    tabs = savedTabs;
    if (tabs.length > 0) {
        switchTab(tabs[0].id);
    }
}

// Switch between tabs
function switchTab(tabId) {
    const tab = tabs.find(t => t.id === tabId);
    if (!tab) return;

    // Remove active class from all tabs
    tabs.forEach(t => {
        if (t.element) {
            t.element.classList.remove('active');
        }
    });

    // Set content and activate the selected tab
    if (currentTab !== tabId) {
        const contentToSet = tab.content.trim() === '' ? "--[[ Created by Salad\ndiscord.gg/getsalad\n ]]" : tab.content;
        editor.setValue(contentToSet);
        tab.element.classList.add('active');
        currentTab = tabId;
    }
}

// Autosave logic
function setupAutosave() {
    let saveTimeout;
    editor.onDidChangeModelContent(() => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            if (currentTab) {
                const tab = tabs.find(t => t.id === currentTab);
                if (tab) {
                    tab.content = editor.getValue();
                    saveTabs();
                }
            }
        }, 1000);
    });
}

// Enable or disable auto-completion
function enableAutoComplete() {
    editor.updateOptions({
        suggestOnTriggerCharacters: true,
        acceptSuggestionOnEnter: "smart",
        wordBasedSuggestions: true,
    });
}

function disableAutoComplete() {
    editor.updateOptions({
        suggestOnTriggerCharacters: false,
        acceptSuggestionOnEnter: "off",
        wordBasedSuggestions: false,
    });
}

// Show and hide the minimap
function showMinimap() {
    editor.updateOptions({
        minimap: { enabled: true },
    });
}

function hideMinimap() {
    editor.updateOptions({
        minimap: { enabled: false },
    });
}

// Add IntelliSense for Lua functions, classes, and keywords
function addIntelliSense(label, kind, detail, insertText) {
    Proposals.push({
        label: label,
        kind: monaco.languages.CompletionItemKind[kind],
        detail: detail,
        insertText: insertText
    });
}

// Load IntelliSense proposals for Lua
async function loadIntelliSense() {
    const docs = await fetch('https://raw.githubusercontent.com/iceycold3/monaco/refs/heads/main/lib.json').then(res => res.json());
    for (let prop in docs) {
        docs[prop].forEach(doc => addIntelliSense(doc.label, doc.type, doc.description, doc.insert));
    }

    const keywords = ["_G", "_VERSION", "Enum", "game", "plugin", "settings"];
    keywords.forEach(keyword => addIntelliSense(keyword, "Keyword", keyword, keyword));

    const functions = ["print", "warn", "math.abs", "math.cos"];
    functions.forEach(func => addIntelliSense(func, "Function", func, func));
}

// Initialize everything
function initializeEditor() {
    loadTabs();
    setupAutosave();
    loadIntelliSense();
}

// Call initialization function on page load
initializeEditor();
