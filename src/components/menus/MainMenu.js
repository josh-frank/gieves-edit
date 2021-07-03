import { useState } from "react";

import { useSelector } from "react-redux";

import CommandsPanel from "../menus/CommandsPanel";
import FilePanel from "../menus/FilePanel";
import ModePanel from "../menus/ModePanel";
import PathPanel from "../menus/PathPanel";
import TransformPanel from "../menus/TransformPanel";

export default function MainMenu() {

    const { dark } = useSelector( state => state.artboard );

    const { activeShape } = useSelector( state => state.shapes );

    const [ manualPathEdit, setManualPathEdit ] = useState( null );

    const [ transformation, setTransformation ] = useState( { translate: [ 1, 1 ], scale: [ 1, 1 ] } );

    const [ collapseMenu, toggleCollapseMenu ] = useState( false );

    return <div className="menu-container">
        { !collapseMenu && <section className={ dark ? "menu dark" : "menu light" } >
            <FilePanel />
            <ModePanel />
            <PathPanel
                activeShape={ activeShape }
                manualPathEdit={ manualPathEdit }
                setManualPathEdit={ setManualPathEdit }
            />
            <TransformPanel
                activeShape={ activeShape }
                transformation={ transformation }
                setTransformation={ setTransformation }
            />
            <CommandsPanel />
        </section> }
        <button
            className={ dark ? "collapse-button dark" : "collapse-button light" }
            onClick={ () => toggleCollapseMenu( !collapseMenu ) }
        >
            { collapseMenu ? "▶" : "◀" }
        </button>
    </div>;

}
