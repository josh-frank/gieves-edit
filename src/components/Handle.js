export default function Handle( { parsedCommand } ) {

    return <>
        <circle
            cx={ parsedCommand.point[ 0 ] }
            cy={ parsedCommand.point[ 1 ] }
            r="3"
            fill="red"
        />
    </>;

}