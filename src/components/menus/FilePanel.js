import { useRef } from "react";

import { useDispatch, useSelector } from "react-redux";
import { loadShapes } from "../../redux/shapesSlice";

import { downloadPathsAsSvgFile, parsePathsFromSvgFile } from "../../utilities/fileUtilities";

export default function FilePanel() {

    const dispatch = useDispatch();

    const { activeShape, inactiveShapes } = useSelector( state => state.shapes );
    const { width, height } = useSelector( state => state.artboard );

    const uploadRef = useRef( null );

    const handleUpload = uploadEvent => {
        const uploadedFile = uploadEvent.target.files[ 0 ];
        if ( uploadedFile && uploadedFile.type === "image/svg+xml" ) {
            const fileReader = new FileReader();
            fileReader.onload = async loadEvent => dispatch( loadShapes( parsePathsFromSvgFile( loadEvent.target.result ) ) );
            fileReader.readAsText( uploadedFile );
        }
    };

    const handleDownload = () => {
        downloadPathsAsSvgFile( activeShape ? [ activeShape, ...inactiveShapes ] : [ ...inactiveShapes ], [ width, height ] );
    };

    return <div className="menu-panel">
        <div className="menu-header">File</div>
        <input
            type="file"
            ref={ uploadRef }
            onChange={ handleUpload }
            hidden
        />
        <button onClick={ () => uploadRef.current.click() }>🗂 <b>Load from SVG</b></button>
        <button onClick={ handleDownload }>〈／〉 <b>Download as SVG</b></button>
    </div>;

}