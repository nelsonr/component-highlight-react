import { useEffect, useState } from "react";
import { OSComponent } from "../types";
import { env } from "../utils";
import List from "./List";

type PopupState = {
    list: OSComponent[];
    currentSelector: string | null;
    isOSApp: boolean | null;
    isLoading: boolean;
    filter: string;
}

const initialState: PopupState = {
    list: [],
    currentSelector: null,
    isOSApp: null,
    isLoading: true,
    filter: "",
};

function Popup () {
    const [ state, setState ] = useState<PopupState>(initialState);

    useEffect(() => {
        env.runtime.sendMessage({ action: "get-list" });

        env.runtime.onMessage.addListener((message) => {
            if (message.action == "list" && message.list) {
                setState({
                    ...state,
                    list: message.list,
                    currentSelector: message.currentSelector,
                    isOSApp: message.isOSApp,
                    isLoading: false
                });
            }
        });
    }, []);

    const toggleHighlight = (selector: string | null) => { 
        if (selector) {
            env.runtime.sendMessage({
                action: "highlight",
                selector: selector 
            });
        } else {
            env.runtime.sendMessage({ action: "clear" });
        }

        setState({
            ...state,
            currentSelector: selector 
        }); 
    };

    const renderState = () => {
        if (state.isLoading) {
            return (
                <h4 className="message">Loading...</h4>
            );
        }

        if (state.isOSApp) {
            return (
                <List 
                    list={state.list}
                    currentSelector={state.currentSelector}
                    onItemClick={toggleHighlight} 
                />
            );
        } else {
            return (
                <h4 className="message">No OutSystems app found.</h4>
            );
        }
    };

    return (
        <div className="popup">
            <header>
                <img src="icons/48x48.png" width={16} />
                <h2 className="title">Component Highlight</h2>
            </header>
            {renderState()}
        </div>
    );
}

export default Popup;
