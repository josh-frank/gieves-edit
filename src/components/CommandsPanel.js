import { useSelector } from "react-redux";

import styled from "styled-components";

import { Path } from "../utilities/PathParser";

const StyledInput = styled.input.attrs( ( { characterLength } ) => ( {
    style: { width: `${ characterLength }ch` },
} ) )``;

const CommandRow = ( { commandLetter, command, dark } ) => <div className="command-row">
    <StyledInput
        className={ dark ? "dark" : null }
        type="text"
        defaultValue={ commandLetter }
        characterLength={ 1.5 }
    />
    { command.map( ( parameter, index ) => <StyledInput
        className={ dark ? "dark" : null }
        type="number"
        key={ index }
        defaultValue={ parameter }
        characterLength={ Math.min( parameter.toString().length, 4 ) }
    /> ) }
</div>;

export default function CommandsPanel() {

    const { activeShape } = useSelector( state => state.shapes );

    const { dark } = useSelector( state => state.artboard );
    
    const activePath = activeShape && new Path( activeShape );

    const CommandFields = () => activePath && <section className="command-fields">
        { activePath.parsedCommands.map( ( parsedCommand, index ) => <CommandRow
            key={ index }
            commandLetter={ parsedCommand.commandLetter }
            command={ parsedCommand.commandLetter === parsedCommand.commandLetter.toLowerCase() ? parsedCommand.relativeCommand : parsedCommand.absoluteCommand }
            dark={ dark }
        /> ) }
    </section>;

    return <div className="menu-panel">
        <div className="menu-header">Commands</div>
        { activeShape ? <CommandFields /> : <i>No path selected</i> }
    </div>;

}