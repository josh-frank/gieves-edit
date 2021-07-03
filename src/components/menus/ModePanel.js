import { useDispatch, useSelector } from "react-redux";
import { panMode, pathMode } from "../../redux/modeSlice";

export default function ModePanel() {

    const dispatch = useDispatch();

    const editMode = useSelector( state => state.editMode );

    return <div className="menu-panel">
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

}