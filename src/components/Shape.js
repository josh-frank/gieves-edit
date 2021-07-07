import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { activateShape, deactivateShape } from "../redux/shapesSlice";

import { Path } from "../utilities/PathParser";

import Handle from "./Handle";

export default function Shape( { descriptor } ) {

    const dispatch = useDispatch();

    const active = useSelector( state => state.shapes ).activeShape === descriptor;
    
    const { dark } = useSelector( state => state.artboard );

    const [ hover, toggleHover ] = useState( false );

    const { zoom, offsetX, offsetY } = useSelector( state => state.artboard );

    const shapePath = active && new Path( descriptor );
    // console.log( 'shapePath: ', shapePath );

    function activate() {
        dispatch( activateShape( descriptor ) );
    }

    function deactivate() {
        dispatch( deactivateShape() );
    }

    return <g
        transform={ `translate( ${ offsetY.toFixed( 2 ) } ${ offsetX.toFixed( 2 ) } ) scale( ${ zoom / 100 } ${ zoom / 100 } )` }
    >
        <path
            d={ descriptor }
            stroke={ hover | active ? "red" : dark ? "white" : "black" }
            strokeWidth="1"
            fill={ dark ? "black" : "white" }
            onMouseEnter={ () => toggleHover( true ) }
            onMouseLeave={ () => toggleHover( false ) }
            onClick={ active ? deactivate : activate }
        />
        { active && shapePath.parsedCommands.filter( parsedCommand => parsedCommand.commandLetter.toLowerCase() !== "z" ).map( parsedCommand => {
            return <Handle
                key={ parsedCommand.index }
                parsedCommand={ parsedCommand }
            />;
        } ) }
    </g>;

}