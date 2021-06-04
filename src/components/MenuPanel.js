import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { zoomMode, pathMode } from '../redux/modeSlice';
import { updateActiveShape } from "../redux/shapesSlice";

import PathParser from "../utilities/PathParser";

const ModePanel = ( { dispatch, editMode } ) => <div className="menu-panel">
    <div className="menu-header">Edit mode</div>
    <button
        disabled={ editMode === "zoom" }
        onClick={ () => dispatch( zoomMode() ) }
    >
        🔎 <b>Zoom</b>
    </button>
    <button
        disabled={ editMode === "path" }
        onClick={ () => dispatch( pathMode() ) }
    >
        👆 <b>Path</b>
    </button>
</div>;

const PathPanel = ( { manualPathEdit, setManualPathEdit, activeShape, dispatch, gridInterval } ) => <div className="menu-panel">
    <div className="menu-header">Path</div>
    <form
        onSubmit={ submitEvent => {
            submitEvent.preventDefault();
            try {
                dispatch( updateActiveShape( PathParser.parseRaw( manualPathEdit ).flat().join( " " ) ) );
                setManualPathEdit( null );
            } catch ( error ) {
                setManualPathEdit( error );
            }
        } }
    >
        <textarea
            rows="6"
            value={ manualPathEdit || activeShape || "No path selected" }
            onChange={ changeEvent => activeShape && setManualPathEdit( changeEvent.target.value ) }
        />
        <input
            disabled={ !manualPathEdit }
            type="submit"
            value={ "💾 Save manual path edits" }
        />
    </form>
    <button disabled>
        𝙈 <b>Convert path to absolute</b>
    </button>
    <button disabled>
        𝙢 <b>Convert path to relative</b>
    </button>
    <button
        onClick={ () => {
            if ( activeShape ) dispatch( updateActiveShape( PathParser.snapPathToGrid( activeShape, gridInterval ) ) );
        } }
    >
        👌 <b>Snap path to grid</b>
    </button>
</div>;

export default function Menu() {

    const dispatch = useDispatch();

    const { gridInterval } = useSelector( state => state.artboard );

    const { activeShape } = useSelector( state => state.shapes );

    const editMode = useSelector( state => state.editMode );

    const [ manualPathEdit, setManualPathEdit ] = useState( null );

    return <div className="menu">
        <ModePanel
            dispatch={ dispatch }
            editMode={ editMode }
        />
        <PathPanel
            manualPathEdit={ manualPathEdit }
            setManualPathEdit={ setManualPathEdit }
            activeShape={ activeShape }
            dispatch={ dispatch }
            gridInterval={ gridInterval }
        />
    </div>;

}