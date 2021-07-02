import { useSelector } from "react-redux";

import { downloadPathsAsSvgFile } from "../utilities/pathsToSvgFile";

export default function FilePanel() {

    const { activeShape, inactiveShapes } = useSelector( state => state.shapes );
    const { width, height } = useSelector( state => state.artboard );

    return <div className="menu-panel">
        <div className="menu-header">File</div>
        <button
            onClick={ () => downloadPathsAsSvgFile( [ activeShape, ...inactiveShapes ], [ width, height ] ) }
        >
            〈／〉 <b>Download as SVG</b>
        </button>
    </div>;

}