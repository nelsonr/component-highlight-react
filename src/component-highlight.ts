// This content script will be loaded in every browser page (this can be configured in the manifest file).
// It's recommended to rename this file to something more meaningful so it's easy to find with the browser devtools.
// Learn more: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts

let currentSelector: string | null = null;

function highlight (selector: string) {
    const highlightStyles = `
        ${selector} * {
            outline: 1px dashed hotpink !important;
        }
    `;

    let style = document.head.querySelector(
        "style[data-type='component-highlight']"
    );

    if (!style) {
        style = document.createElement("style");
        style.setAttribute("data-type", "component-highlight");
        document.head.appendChild(style);
    }

    style.textContent = highlightStyles;
    currentSelector = selector;
}

function clear () {
    const style = document.head.querySelector("[data-type='component-highlight']");

    if (style) {
        style.remove();
    }

    currentSelector = null;
}

function getComponents () {
    const blocks = Array.from(document.querySelectorAll("[data-block]"));
    const uniqueBlocks = new Set(
        blocks.map((el) => el.getAttribute("data-block"))
    );

    return Array
        .from(uniqueBlocks)
        .sort()
        .map((name) => ({
            name: name,
            selector: `[data-block="${name}"]`,
        }));
}

function isOutSystemsApp () {
    return (document.head.querySelector("script[src*='OutSystems']") !== null);
}

function main () {
    const env = chrome || browser;

    env.runtime.onMessage.addListener((message) => {
        console.log(message);

        if (message.action == "get-list") {
            env.runtime.sendMessage({
                action: "list",
                isOSApp: isOutSystemsApp(),
                list: getComponents(),
                currentSelector: currentSelector,
            });
        }

        if (message.action == "highlight") {
            highlight(message.selector);
        }

        if (message.action == "clear") {
            clear();
        }
    });
}

window.addEventListener("load", main);

// This is just for keeping the TypeScript compiler happy :)
export { };
