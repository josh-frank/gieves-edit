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
                onClick={ () => setMenuToDisplay( menuItem ) }
                onBlur={ () => setMenuToDisplay( null ) }
            >
                <u>{ menuItem.slice( 0, 1 ) }</u>{ menuItem.slice( 1 ) }
            </button>;
        } ) }
        { menuToDisplay && <div className="sub-menu">
            { menuItems[ menuToDisplay ].map( subMenuItem => {
                return <button
                    key={ subMenuItem }
                >
                    <u>{ subMenuItem.slice( 0, 1 ) }</u>{ subMenuItem.slice( 1 ) }
                </button>;
            } ) }
        </div> }
    </div>;

}