import { useSelector } from "react-redux";
import { Path } from "../utilities/PathParser";

const CommandRow = ( { commandLetter, command } ) => <div className="command-row">
    <input value={ commandLetter } />
    { command.map( ( parameter, index ) => <input type="number" key={ index } defaultValue={ parameter } /> ) }
</div>;

export default function CommandsPanel() {

    const { activeShape } = useSelector( state => state.shapes );

    const activePath = activeShape && new Path( activeShape );

    const CommandFields = () => activePath && <section className="command-fields">
        { activePath.parsedCommands.map( ( parsedCommand, index ) => <CommandRow
            key={ index }
            commandLetter={ parsedCommand.commandLetter }
            command={ parsedCommand.commandLetter === parsedCommand.commandLetter.toLowerCase() ? parsedCommand.relativeCommand : parsedCommand.absoluteCommand }
        /> ) }
    </section>;

    return <div className="menu-panel">
        <div className="menu-header">Commands</div>
        { activeShape ? <CommandFields /> : <i>No path selected</i> }
    </div>;

}