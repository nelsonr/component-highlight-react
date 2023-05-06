import { OSComponent } from "../types";

type ListItemProps = OSComponent & {
    currentSelector: string | null;
    onClick: (selector: string | null) => unknown;
}

function ListItem (props: ListItemProps) {
    const { name, selector, currentSelector, onClick } = props;
    const isActive = selector === currentSelector;
    const className = isActive ? "active" : "";

    const handleClick = () => {
        if (isActive) {
            onClick(null);
        } else {
            onClick(selector);
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
