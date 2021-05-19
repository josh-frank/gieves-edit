import { useSelector } from "react-redux";

export default function ArtboardViewInfo() {

    const { width, height, zoom, offsetX, offsetY } = useSelector( state => state.artboardDisplayOptions );

    return <div className="artboard-view-info">
        🤚 { offsetX - 50 }, { offsetY - 50 } • 📏 { width } x { height } • 🔎 { zoom * 100 }%
    </div>;

}