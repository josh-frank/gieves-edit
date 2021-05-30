export default function Handle( { command, parsedCommand } ) {
    console.log('command: ', command);
    console.log('parsedCommand: ', parsedCommand);

    return <>
        <circle
            cx={ parsedCommand.point[ 0 ] }
            cy={ parsedCommand.point[ 1 ] }
            r="2"
            fill="red"
        />
        { parsedCommand.controlPoint && <g>
            <circle
                cx={ parsedCommand.controlPoint[ 0 ] }
                cy={ parsedCommand.controlPoint[ 1 ] }
                r="2"
                fill="red"
            />
            <line
                x1={ parsedCommand.point[ 0 ] }
                y1={ parsedCommand.point[ 1 ] }
                x2={ parsedCommand.controlPoint[ 0 ] }
                y2={ parsedCommand.controlPoint[ 1 ] }
                stroke="red"
            />
        </g>}
    </>;

}