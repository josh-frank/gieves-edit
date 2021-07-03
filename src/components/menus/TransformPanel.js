import { useDispatch, useSelector } from "react-redux";
import { updateActiveShape } from "../../redux/shapesSlice";

import { Path } from "../../utilities/PathParser";

export default function TransformPanel( { transformation, setTransformation } ) {

    const dispatch = useDispatch();

    const { gridInterval } = useSelector( state => state.artboard );

    const { activeShape } = useSelector( state => state.shapes );

    const activePath = activeShape && new Path( activeShape );

    return <div className="menu-panel">
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

}