import { useDispatch, useSelector } from "react-redux";
import { zoomMode, pathMode } from '../redux/modeSlice';
import { updateActiveShape } from "../redux/shapesSlice";
import { snapPathToGrid } from "../utilities/descriptorUtilities";


export default function Menu() {

    const dispatch = useDispatch();

    const { gridInterval } = useSelector( state => state.artboard );

    const { activeShape } = useSelector( state => state.shapes );

    const editMode = useSelector( state => state.editMode );

    const ModePanel = () => <div className="menu-panel">
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

    const PathPanel = () => <div className="menu-panel">
        <div className="menu-header">Path</div>
        <textarea
            rows="6"
            readOnly
            value={ activeShape || "No path selected" }
        />
        <button>
            💾 <b>Save manual path edits</b>
        </button>
        <button>
            𝙈 <b>Convert path to absolute</b>
        </button>
        <button>
            𝙢 <b>Convert path to relative</b>
        </button>
        <button
            onClick={ () => {
                if ( activeShape ) dispatch( updateActiveShape( snapPathToGrid( activeShape, gridInterval ) ) );
            } }
        >
            👌 <b>Snap path to grid</b>
        </button>
    </div>;

    return <div className="menu">
        <ModePanel />
        <PathPanel />
    </div>;

}