import { OSComponent } from "../types";

type ListItemProps = OSComponent & {
    activeSelectors: Set<string>;
    onSelectorToggle: (selector: string, type: "add" | "remove") => unknown;
}

function ListItem (props: ListItemProps) {
    const { name, selector, activeSelectors, onSelectorToggle } = props;
    const isActive = activeSelectors.has(selector);
    const className = isActive ? "active" : "";

    const handleClick = () => {
        if (isActive) {
            onSelectorToggle(selector, "remove");
        } else {
            onSelectorToggle(selector, "add");
        }
    };
    
    return (
        <li 
            className={className}
            onClick={handleClick}
        >
            <span>{name}</span>
        </li>
    );
}

export default ListItem;
