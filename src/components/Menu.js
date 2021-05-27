import { useState } from "react";

const menuItems = {
    "File": [ "Save", "Load" ],
    "View": [ "Zoom" ],
    "Path": [ "Transform/Scale", "Translate", "Round" ]
};

export default function Menu() {

    const [ menuToDisplay, setMenuToDisplay ] = useState( null );

    return <div className="menu">
        { Object.keys( menuItems ).map( menuItem => {
            return <button
                key={ menuItem }
                className="menu-button"
                onClick={ () => setMenuToDisplay( menuItem ) }
            >
                <u>{ menuItem.slice( 0, 1 ) }</u>{ menuItem.slice( 1 ) }
            </button>;
        } ) }
    </div>;

}