export default function Handle( { fullDescriptor, parsedCommand } ) {

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
            data-descriptor={ fullDescriptor }
            data-command={ parsedCommand.command }
            cx={ parsedCommand.point[ 0 ] }
            cy={ parsedCommand.point[ 1 ] }
            r="2"
            fill="red"
            // onMouseOver={ () => console.log( parsedCommand.command ) }
        />
        { parsedCommand.startHandle && <>
            <circle
                data-name="startHandle"
                data-descriptor={ fullDescriptor }
                data-command={ parsedCommand.command }
                cx={ parsedCommand.startHandle[ 2 ] }
                cy={ parsedCommand.startHandle[ 3 ] }
                r="2"
                fill="red"
                // onMouseOver={ () => console.log( parsedCommand.command ) }
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
                data-descriptor={ fullDescriptor }
                data-command={ parsedCommand.command }
                cx={ parsedCommand.endHandle[ 2 ] }
                cy={ parsedCommand.endHandle[ 3 ] }
                r="2"
                fill="red"
                // onMouseOver={ () => console.log( parsedCommand.command ) }
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