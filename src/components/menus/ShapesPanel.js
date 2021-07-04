import { useDispatch, useSelector } from "react-redux";
import { removeShape } from "../../redux/shapesSlice";

export default function ShapesPanel() {

    const dispatch = useDispatch();

    const { activeShape } = useSelector( state => state.shapes );

    return <div className="menu-panel">
        <div className="menu-header">Shapes</div>
        <section className="menu-row">
            {/* <button
                onClick={}
            >
                ➕ <b>Add new shape</b>
            </button> */}
            <button
                disabled={ !activeShape }
                onClick={ () => dispatch( removeShape( activeShape ) ) }
            >
                ➖ <b>Delete active shape</b>
            </button>
        </section>
    </div>;

}