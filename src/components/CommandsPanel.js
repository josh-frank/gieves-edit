import { useState } from "react";
import { useSelector } from "react-redux";

import styled from "styled-components";

import { Path } from "../utilities/PathParser";

const StyledInput = styled.input.attrs( ( { characterLength } ) => ( {
    style: { width: `${ characterLength }ch` },
} ) )``;
         
const CommandRow = ( { parsedCommand, commandEdit, setCommandEdit, dark } ) => {
    const commandToEdit = parsedCommand.commandLetter === parsedCommand.commandLetter.toLowerCase() ? parsedCommand.relativeCommand : parsedCommand.absoluteCommand;
    return <div className="command-row">
        <button>
            { parsedCommand.commandLetter }
        </button>
        { commandToEdit.map( ( parameter, parameterIndex ) => <StyledInput
            className={ dark ? "dark" : null }
            type="number"
            key={ parameterIndex }
            value={ commandEdit.commandIndex === parsedCommand.index && commandEdit.parameterIndex === parameterIndex ? commandEdit.parameter : parameter }
            characterLength={ Math.min( parameter.toString().length, 4 ) }
            onFocus={ () => setCommandEdit( {
                commandIndex: parsedCommand.index,
                parameterIndex: parameterIndex,
                commandLetter: parsedCommand.commandLetter,
                parameter: parameter
            } ) }
            onBlur={ () => setCommandEdit( {
                commandIndex: null,
                parameterIndex: null,
                commandLetter: null,
                parameter: null
            } ) }
            onChange={ changeEvent => setCommandEdit( {
                ...commandEdit,
                parameter: parseInt( changeEvent.target.value )
            } ) }
        /> ) }
    </div>;
};

export default function CommandsPanel() {

    const { activeShape } = useSelector( state => state.shapes );

    const { dark } = useSelector( state => state.artboard );
    
    const activePath = activeShape && new Path( activeShape );

    const [ commandEdit, setCommandEdit ] = useState( {
        commandIndex: null,
        parameterIndex: null,
        commandLetter: null,
        parameter: null
    } );

    return <div className="menu-panel">
        <div className="menu-header">Commands</div>
        { activePath ? <section className="command-fields">
            { activePath.parsedCommands.map( ( parsedCommand, index ) => <CommandRow
                key={ index }
                parsedCommand={ parsedCommand }
                commandEdit={ commandEdit}
                setCommandEdit={ setCommandEdit }
                dark={ dark }
            /> ) }
        </section> : <i>No path selected</i> }
    </div>;

}
