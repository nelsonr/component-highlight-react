import { env, getCurrentTab } from "../utils";

env.runtime.onMessage.addListener((message) => {
    console.log("Message received:", message);
    
    getCurrentTab().then(
        (tab) => {
            if (tab && tab.id) {
                if ([ "get-list", "highlight" ].includes(message.action)) {
                    env.tabs.sendMessage(tab.id, message);
                }
            }
        },
        (error) => console.error(error)
    );
});

export { };
