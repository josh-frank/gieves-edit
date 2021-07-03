import { useSelector } from "react-redux";

export default function ShapesPanel() {

    const { activeShape } = useSelector( state => state.shapes );

    return <div className="menu-panel">
        <div className="menu-header">Shapes</div>
        <section className="menu-row">
            <button
                // onClick={}
            >
                ➕ <b>Add new shape</b>
            </button>
            <button
                disabled={ !activeShape }
                // onClick={}
            >
                ➖ <b>Delete active shape</b>
            </button>
        </section>
    </div>;

}