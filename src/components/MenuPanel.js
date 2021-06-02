import { useDispatch, useSelector } from "react-redux";
import { zoomMode, pathMode } from '../redux/modeSlice';


export default function Menu() {

    const dispatch = useDispatch();

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
    </div>;

    return <div className="menu">
        <ModePanel />
        <PathPanel />
    </div>;

}