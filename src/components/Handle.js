export default function Handle( { parsedCommand } ) {

    // const QuadPolyline = () => {
    //     return <polyline
    //         points={ parsedCommand.quadPolyLine.join( " " ) }
    //         fill="none"
    //         stroke="red"
    //     />;
    // };

    return <g>
        <circle
            data-name="point"
            data-command-index={ parsedCommand.index }
            cx={ parsedCommand.absoluteNext[ 0 ] }
            cy={ parsedCommand.absoluteNext[ 1 ] }
            r="3"
            fill="red"
            // onMouseOver={ () => console.log( parsedCommand.commandLetter ) }
        />
        { parsedCommand.startHandle && <>
            <circle
                data-name="startHandle"
                data-command-index={ parsedCommand.index }
                cx={ parsedCommand.startHandle[ 2 ] }
                cy={ parsedCommand.startHandle[ 3 ] }
                r="3"
                fill="red"
                // onMouseOver={ () => console.log( parsedCommand.commandLetter ) }
            />
            <line
                x1={ parsedCommand.startHandle[ 0 ] }
                y1={ parsedCommand.startHandle[ 1 ] }
                x2={ parsedCommand.startHandle[ 2 ] }
                y2={ parsedCommand.startHandle[ 3 ] }
                stroke="red"
            />
        </> }
        { parsedCommand.endHandle && <>
            <circle
                data-name="endHandle"
                data-command-index={ parsedCommand.index }
                cx={ parsedCommand.endHandle[ 2 ] }
                cy={ parsedCommand.endHandle[ 3 ] }
                r="3"
                fill="red"
                // onMouseOver={ () => console.log( parsedCommand.commandLetter ) }
            />
            <line
                x1={ parsedCommand.endHandle[ 0 ] }
                y1={ parsedCommand.endHandle[ 1 ] }
                x2={ parsedCommand.endHandle[ 2 ] }
                y2={ parsedCommand.endHandle[ 3 ] }
                stroke="red"
            />
        </> }
    </g>;

}