import { useState } from "react";

import { useDispatch } from "react-redux";
import { activateShape, deactivateShape } from "../redux/shapesSlice";

import { parseDescriptor } from "../utilities/descriptorUtilities";

import Handle from "./Handle";

export default function Shape( { descriptor, active } ) {

    const dispatch = useDispatch();

    const [ hover, toggleHover ] = useState( false );

    function toggleActive() {
        dispatch( active ? deactivateShape( descriptor ) : activateShape( descriptor ) );
    }

    const parsedDescriptor = active && parseDescriptor( descriptor );

    return <g>
        <path
            d={ descriptor }
            stroke={ hover ? "green" : active ? "blue" : "black" }
            strokeWidth="1"
            fill="white"
            onMouseEnter={ () => toggleHover( true ) }
            onMouseLeave={ () => toggleHover( false ) }
            onClick={ toggleActive }
        />
        { active && parsedDescriptor.filter( point => point.command !== "z" ).map( parsedPoint => {
            return <Handle
                key={ parsedPoint.index }
                fullDescriptor={ descriptor }
                command={ parsedPoint.command }
                parsedCommand={ parsedPoint }
            />;
        } ) }
    </g>;

}