let activeSelectors: Set<string> = new Set();

function generateHighlightStyles (selectors: Set<string>) {
    const CSSSelector = Array
        .from(selectors)
        .map((selector) => `${selector} *`)
        .join(",\r\n");
    
    return `${CSSSelector} {
        outline: 1px dashed hotpink !important;
    }`;
}

function toggleHighlight (selectors: Set<string>) {
    let styleEl = document.head.querySelector("style[data-type='component-highlight']");

    if (selectors.size === 0 && styleEl) {
        return styleEl?.remove();   
    }

    if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.setAttribute("data-type", "component-highlight");
        document.head.appendChild(styleEl);
    }

    const highlightStyles = generateHighlightStyles(selectors);
    styleEl.textContent = highlightStyles;
    activeSelectors = selectors;
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
                list: getComponents(),
                isOSApp: isOutSystemsApp(),
                activeSelectors: Array.from(activeSelectors)
            });
        }

        if (message.action == "highlight") {
            toggleHighlight(new Set(message.selectors));
        }
    });
}

window.addEventListener("load", main);

// This is just for keeping the TypeScript compiler happy :)
export { };
