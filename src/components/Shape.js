import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { activateShape, deactivateShape } from "../redux/shapesSlice";

import { Path } from "../utilities/PathParser";

import Handle from "./Handle";

export default function Shape( { descriptor, setActive } ) {

    const dispatch = useDispatch();

    const active = useSelector( state => state.shapes ).activeShape === descriptor;

    const [ hover, toggleHover ] = useState( false );

    function activate() {
        dispatch( activateShape( descriptor ) );
        setActive( shape );
    }

    function deactivate() {
        dispatch( deactivateShape() );
        setActive( null );
    }

    const shape = new Path( descriptor );

    return <g>
        <path
            d={ descriptor }
            stroke={ hover ? "green" : active ? "blue" : "black" }
            strokeWidth="1"
            fill="white"
            onMouseEnter={ () => toggleHover( true ) }
            onMouseLeave={ () => toggleHover( false ) }
            onClick={ active ? deactivate : activate }
        />
        { active && shape.parsedCommands.map( ( parsedCommand, index ) => {
            return <Handle
                key={ index }
                fullDescriptor={ descriptor }
                parsedCommand={ parsedCommand }
            />;
        } ) }
    </g>;

}