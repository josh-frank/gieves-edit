import { useDispatch } from "react-redux";
import { zoomIn, zoomOut } from "../redux/artboardSlice";

export default function ZoomButtons() {

    const dispatch = useDispatch();

    return <div className="zoom-buttons">
        <button onClick={ () => dispatch( zoomIn() ) }>➕</button>
        <button onClick={ () => dispatch( zoomOut() ) }>➖</button>
    </div>;

}