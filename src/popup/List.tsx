import { ChangeEvent, useRef, useState } from "react";
import { OSComponent } from "../types";
import ListItem from "./ListItem";

type ListProps = {
    list: OSComponent[];
    currentSelector: string | null;
    onItemClick: (selector: string | null) => unknown;
}

type ListState = {
    filter: string;
}

const initialState: ListState = { filter: "" };

function List (props: ListProps) {
    const { list, currentSelector, onItemClick } = props;
    const [ state, setState ] = useState<ListState>(initialState);
    const inputElementRef = useRef<HTMLInputElement>(null);

    const updateFilter = (ev: ChangeEvent<HTMLInputElement>) => setState({
        ...state,
        filter: ev.target.value 
    });

    const filterRegex = new RegExp(state.filter.trim(), "gi");
    
    const filteredList = list.filter((item: OSComponent) => {
        const filterEnabled = state.filter.trim().length >= 2;
        const matchesFilter = item.name.match(filterRegex) !== null;
            
        if (filterEnabled) {
            return matchesFilter;
        } 
        
        return true;
    });

    const categories = Array.from(new Set(filteredList.map((item) => item.name.split(".")[0])));

    const renderList = () => {
        return categories.map((category) => {
            const renderedList = filteredList
                .filter((item) => item.name.startsWith(category))
                .map((item) => 
                    <ListItem 
                        key={item.name}
                        name={item.name.split(".")[1]} 
                        selector={item.selector} 
                        currentSelector={currentSelector}
                        onClick={onItemClick}
                    />
                );
            
            return (
                <section key={category}>
                    <h4>{category}</h4>
                    <ul>{renderedList}</ul>
                </section>
            );
        });
    };
    
    return (
        <div className="list">
            <div className="search">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M18.319 14.4326C20.7628 11.2941 20.542 6.75347 17.6569 3.86829C14.5327 0.744098 9.46734 0.744098 6.34315 3.86829C3.21895 6.99249 3.21895 12.0578 6.34315 15.182C9.22833 18.0672 13.769 18.2879 16.9075 15.8442C16.921 15.8595 16.9351 15.8745 16.9497 15.8891L21.1924 20.1317C21.5829 20.5223 22.2161 20.5223 22.6066 20.1317C22.9971 19.7412 22.9971 19.1081 22.6066 18.7175L18.364 14.4749C18.3493 14.4603 18.3343 14.4462 18.319 14.4326ZM16.2426 5.28251C18.5858 7.62565 18.5858 11.4246 16.2426 13.7678C13.8995 16.1109 10.1005 16.1109 7.75736 13.7678C5.41421 11.4246 5.41421 7.62565 7.75736 5.28251C10.1005 2.93936 13.8995 2.93936 16.2426 5.28251Z" fill="currentColor" /></svg>
                
                <input
                    ref={inputElementRef}
                    type="text"
                    value={state.filter}
                    onInput={updateFilter}
                    autoFocus={true}
                    placeholder="Filter components..."
                />
            </div>
            <div>{renderList()}</div>
        </div>
    );
}

export default List;
