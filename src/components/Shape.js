import { useState } from "react";
import { useDispatch } from "react-redux";
import { activateShape, deactivateShape } from "../redux/shapesSlice";
import { pointsFromDescriptor } from "../utilities/parseDescriptor";
import Handle from "./Handle";

export default function Shape( { descriptor, active } ) {

    const dispatch = useDispatch();

    const [ hover, toggleHover ] = useState( false );

    function toggleActive() {
        dispatch( active ? deactivateShape( descriptor ) : activateShape( descriptor ) );
    }

    return <g>
        <path
            d={ descriptor }
            stroke={ hover ? "green" : active ? "blue" : "black" }
            strokeWidth="4"
            fill="white"
            onMouseEnter={ () => toggleHover( true ) }
            onMouseLeave={ () => toggleHover( false ) }
            onClick={ toggleActive }
        />
        { active && pointsFromDescriptor( descriptor ).map( ( coordinates, index ) => {
            return <Handle key={ index } coordinates={ coordinates } />;
        } ) }
    </g>;

}