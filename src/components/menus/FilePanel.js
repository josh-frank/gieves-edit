import { useSelector } from "react-redux";

import { downloadPathsAsSvgFile } from "../../utilities/fileUtilities";

export default function FilePanel() {

    const { activeShape, inactiveShapes } = useSelector( state => state.shapes );
    const { width, height } = useSelector( state => state.artboard );

    const onDownload = () => {
        downloadPathsAsSvgFile( activeShape ? [ activeShape, ...inactiveShapes ] : [ ...inactiveShapes ], [ width, height ] );
    };

    return <div className="menu-panel">
        <div className="menu-header">File</div>
        <button
            onClick={ onDownload }
        >
            〈／〉 <b>Download as SVG</b>
        </button>
    </div>;

}