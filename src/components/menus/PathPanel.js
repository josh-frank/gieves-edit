import { useDispatch } from "react-redux";
import { deactivateShape, updateActiveShape } from "../../redux/shapesSlice";

import { PathParser } from "../../utilities/PathParser";

export default function PathPanel( { activeShape, manualPathEdit, setManualPathEdit } ) {

    const dispatch = useDispatch();

    return <div className="menu-panel">
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

}
