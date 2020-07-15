const fs = require ("fs");
const {remote, shell, clipboard} = require ("electron");
const getTextStatistics=require("./lib/get-statistics");

const currentWindow = remote.getCurrentWindow();
let currentFile = null;
let originalContent = "";

const content = document.getElementById("content");
const lineCount = document.getElementById("line-count");
const wordCount = document.getElementById("word-count");
const readingTime= document.getElementById("reading-time");
const openFile = document.getElementById("open-file");
const saveFile = document.getElementById("save-file");
const copyToClipboard = document.getElementById("copy-to-clipboard");

const updateUserInterface = (content) => {
    const {lines, words, text } = getTextStatistics(content);
    wordCount.textContent = words;
    lineCount.textContent = lines;
    readingTime.textContent = text;

    currentWindow.setDocumentEdited(content !== originalContent);
};

content.addEventListener("keydown", () => {
    updateUserInterface(content.value);
});

openFile.addEventListener("click", ()=> {
    const files = remote.dialog.showOpenDialog(currentWindow, {
        title: "Open file",
        properties : ["openFile"],
        filters:[
            {name: "Text Files", extensions : ["txt", "text"]},
            {name: "Markdown Files", extensions : ["md", "markdown"]},

        ]
    });
        if (!files) {return; }

        currentFile=files[0];
    
        const file = currentFile;
        const text = fs.readFileSync(file).toString();
    
        updateCurrentFile(file, text);
    });

    saveFile.addEventListener("click", ()=> {
        const files = currentFile || remote.dialog.showSaveDialog(currentWindow, {
            title: "Save file",
            defaultPath: remote.app.getPath("documents"),
            filters:[
                {name: "Text Files", extensions : ["txt", "text"]},
                {name: "Markdown Files", extensions : ["md", "markdown"]},
    
            ]
        });
        if (!files) {return;}
         
        fs.writeFileSync(file, content.value);
        updateCurrentFile(file, content.value);
        shell.showItemInFolder(file);
   
});

copyToClipboard.addEventListener("click", () => {
    clipboard.writeText(content.value);
})


const updateCurrentFile = (file, text) => {
    currentFile = file;
    originalContent = text;
    content.value = text;

    remote.app.addRecentDocument(file);

    currentWindow.setTitle(file);
    currentWindow.setRepresentedFilename(file);

    updateUserInterface(text);
}