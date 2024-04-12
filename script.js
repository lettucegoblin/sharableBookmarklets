const titleInput = document.getElementById('titleInput');
//const scriptInput = document.getElementById('scriptInput');
const bookmarkletLink = document.getElementById('bookmarkletLink');
const scriptInput = CodeMirror.fromTextArea(document.getElementById('scriptInput'), {
    lineNumbers: true,
    mode: "javascript",
    matchBrackets: true
});


let linkBuilder = {
    title: '',
    encodedScript: '',
    decodedScript: '',
}

window.onload = function () {
    const queryString = new URLSearchParams(window.location.search);
    const script = queryString.get('js');
    const title = queryString.get('title') ? queryString.get('title') : 'Bookmarklet';
    const encodedScript = script ? script : '';
    const decodedScript = script ? decodeURIComponent(script) : '';

    linkBuilder = { ...linkBuilder, title, encodedScript, decodedScript };
    initUI();
    titleInput.addEventListener('input', updateLink);
    //scriptInput.addEventListener('input', tryToEncode);
    scriptInput.on('change', function () {
        tryToEncode();
    });
    prettyPrint()
    //scriptInput.setValue("decodedScript");

};

function prettyPrint() {
    let potentiallyUnformatted = scriptInput.getValue();
    var formattedJS = js_beautify(potentiallyUnformatted, { indent_size: 2 });
    scriptInput.setValue(formattedJS);
}

function tryToEncode() {
    const script = scriptInput.getValue();
    try {
        const encodedScript = encodeURIComponent(script);
        linkBuilder = { ...linkBuilder, encodedScript, decodedScript: script };
        updateLink();
    } catch (e) {
        console.error(e);
    }
}

// builds the link from link builder
function initUI() {
    titleInput.value = linkBuilder.title;
    scriptInput.setValue(linkBuilder.decodedScript)
    bookmarkletLink.href = getLink();
    updateLink();
}

function getLink() {
    return `javascript:${linkBuilder.encodedScript}`;
}

function updateLink() {
    console.log('updating link', linkBuilder);
    if (titleInput.value) {
        linkBuilder.title = titleInput.value;
    }
    bookmarkletLink.innerText = linkBuilder.title;
    bookmarkletLink.href = getLink();
    // change current page's url
    window.history.pushState({}, '', `?title=${linkBuilder.title}&js=${linkBuilder.encodedScript}`);
}

