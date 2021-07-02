import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { panMode, pathMode } from '../redux/modeSlice';
import { deactivateShape, updateActiveShape } from "../redux/shapesSlice";

import { Path, PathParser } from "../utilities/PathParser";
import CommandsPanel from "./CommandsPanel";
import FilePanel from "./FilePanel";

const ModePanel = ( { dispatch, editMode } ) => <div className="menu-panel">
    <div className="menu-header">Mode</div>
    <button
        disabled={ editMode === "pan" }
        onClick={ () => dispatch( panMode() ) }
    >
        🎥 <b>Pan</b>
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
        <section className="menu-row">
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

const TransformPanel = ( { activePath, activeShape, dispatch, gridInterval, transformation, setTransformation } ) => <div className="menu-panel">
    <div className="menu-header">Transform</div>
    <section className="menu-row">
        <button
            disabled={ !activeShape }
            onClick={ () => {
                dispatch( updateActiveShape( activePath.absolute() ) );
            } }
        >
            𝙈 <b>Absolute</b>
        </button>
        <button
            disabled={ !activeShape }
            onClick={ () => {
                dispatch( updateActiveShape( activePath.relative() ) )
            } }
        >
            𝙢 <b>Relative</b>
        </button>
        <button
            disabled={ !activeShape }
            onClick={ () => {
                dispatch( updateActiveShape( activePath.normalized() ) )
            } }
        >
            𝗖 <b>Normalized</b>
        </button>
    </section>
    <section className="menu-row">
        <button
            disabled={ !activeShape }
            onClick={ () => {
                activePath.translate( transformation.translate[ 0 ], transformation.translate[ 1 ] )
                dispatch( updateActiveShape( activePath.toString() ) );
            } }
        >
            Translate
        </button>
        <label htmlFor="translateX">X:</label>
        <input
            type="number"
            name="translateX"
            value={ activeShape ? transformation.translate[ 0 ] : "" }
            onChange={ changeEvent => setTransformation( { ...transformation, translate: [ parseInt( changeEvent.target.value ), transformation.translate[ 1 ] ] } ) }
        />
        <label htmlFor="translateY">Y:</label>
        <input
            type="number"
            name="translateY"
            value={ activeShape ? transformation.translate[ 1 ] : "" }
            onChange={ changeEvent => setTransformation( { ...transformation, translate: [ transformation.translate[ 0 ], parseInt( changeEvent.target.value ) ] } ) }
        />
    </section>
    <section className="menu-row">
        <button
            disabled={ !activeShape }
            onClick={ () => {
                activePath.scale( transformation.scale[ 0 ], transformation.scale[ 1 ] )
                dispatch( updateActiveShape( activePath.toString() ) );
            } }
        >
            Scale
        </button>
        <label htmlFor="scaleX">X:</label>
        <input
            type="number"
            name="scaleX"
            value={ activeShape ? transformation.scale[ 0 ] : "" }
            onChange={ changeEvent => setTransformation( { ...transformation, scale: [ parseInt( changeEvent.target.value ), transformation.scale[ 1 ] ] } ) }
        />
        <label htmlFor="scaleY">Y:</label>
        <input
            type="number"
            name="scaleY"
            value={ activeShape ? transformation.scale[ 1 ] : "" }
            onChange={ changeEvent => setTransformation( { ...transformation, scale: [ transformation.scale[ 0 ], parseInt( changeEvent.target.value ) ] } ) }
        />
    </section>
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

    const { gridInterval, dark } = useSelector( state => state.artboard );

    const { activeShape } = useSelector( state => state.shapes );

    const activePath = activeShape && new Path( activeShape );

    const editMode = useSelector( state => state.editMode );

    const [ manualPathEdit, setManualPathEdit ] = useState( null );

    const [ transformation, setTransformation ] = useState( { translate: [ 1, 1 ], scale: [ 1, 1 ] } );

    const [ collapseMenu, toggleCollapseMenu ] = useState( false );

    return <div className="menu-container">
        { !collapseMenu && <section className={ dark ? "menu dark" : "menu light" } >
            <FilePanel />
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
