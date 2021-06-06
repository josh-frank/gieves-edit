import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { zoomMode, pathMode } from '../redux/modeSlice';
import { deactivateShape, updateActiveShape } from "../redux/shapesSlice";

import { Path, PathParser } from "../utilities/PathParser";

const ModePanel = ( { dispatch, editMode } ) => <div className="menu-panel">
    <div className="menu-header">Mode</div>
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

const PathPanel = ( { manualPathEdit, setManualPathEdit, activeShape, dispatch } ) => <div className="menu-panel">
    <div className="menu-header">Path</div>
    <form
        onSubmit={ submitEvent => {
            submitEvent.preventDefault();
            try {
                dispatch( updateActiveShape( PathParser.parseRaw( manualPathEdit ).flat().join( " " ) ) );
                setManualPathEdit( null );
            } catch ( error ) {
                dispatch( deactivateShape() );
                setManualPathEdit( error );
            }
        } }
    >
        <textarea
            rows="6"
            value={ manualPathEdit || activeShape || "No path selected" }
            onChange={ changeEvent => activeShape && setManualPathEdit( changeEvent.target.value ) }
        />
        <section className="menu-button-row">
            <input
                disabled={ !manualPathEdit }
                type="submit"
                value={ "💾 Save path edits" }
            />
            <button
                disabled={ !manualPathEdit }
                onClick={ () => setManualPathEdit( activeShape ) }
            >
                ❌ Revert
            </button>
        </section>
    </form>
</div>;

const TransformPanel = ( { activePath, setActivePath, activeShape, dispatch, gridInterval } ) => <div className="menu-panel">
    <div className="menu-header">Transform</div>
    <button
        disabled={ !activeShape }
        onClick={ () => {
            dispatch( updateActiveShape( activePath.absolute() ) );
        } }
    >
        𝙈 <b>Convert path to absolute</b>
    </button>
    <button
        disabled={ !activeShape }
        onClick={ () => {
            dispatch( updateActiveShape( activePath.relative() ) )
        } }
    >
        𝙢 <b>Convert path to relative</b>
    </button>
    <button
        disabled={ !activeShape }
        onClick={ () => {
            activePath.snapToGrid( gridInterval );
            dispatch( updateActiveShape( activePath.toString() ) );
        } }
    >
        👌 <b>Snap path to grid</b>
    </button>
</div>;

export default function Menu() {

    const dispatch = useDispatch();

    const { gridInterval } = useSelector( state => state.artboard );

    const { activeShape } = useSelector( state => state.shapes );

    const activePath = activeShape && new Path( activeShape );

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
        />
        <TransformPanel
            activePath={ activePath }
            activeShape={ activeShape }
            dispatch={ dispatch }
            gridInterval={ gridInterval }
        />
    </div>;

}