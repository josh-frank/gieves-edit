import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import styled from "styled-components";
import { updateActiveShape } from "../../redux/shapesSlice";

import { Path } from "../../utilities/PathParser";

const StyledInput = styled.input.attrs( ( { characterLength } ) => ( {
    style: { width: `${ characterLength }ch` },
} ) )``;
         
const CommandRow = ( { fullPath, commandIndex, commandEdit, setCommandEdit, dispatch, dark } ) => {
    const parsedCommand = fullPath.parsedCommands[ commandIndex ];
    let commandToUpdate = parsedCommand.isRelative() ? parsedCommand.relativeCommand : parsedCommand.absoluteCommand;
    if ( parsedCommand.commandLetter.toLowerCase() === "h" ) commandToUpdate = commandToUpdate.slice( 0, 1 );
    else if ( parsedCommand.commandLetter.toLowerCase() === "v" ) commandToUpdate = commandToUpdate.slice( 1 );
    return <div className="command-row">
        <button
            onClick={ () => {
                if ( parsedCommand.isRelative() ) parsedCommand.setAbsolute();
                else parsedCommand.setRelative();
                dispatch( updateActiveShape( fullPath.toString() ) );
            } }
        >
            { parsedCommand.commandLetter }
        </button>
        { commandToUpdate.map( ( parameter, parameterIndex ) => <StyledInput
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
            onBlur={ () => {
                const updatedCommand = [
                    parsedCommand.commandLetter,
                    ...commandToUpdate.slice( 0, parameterIndex ),
                    commandEdit.parameter,
                    ...commandToUpdate.slice( parameterIndex + 1 )
                ];
                parsedCommand.parse( updatedCommand );
                dispatch( updateActiveShape( fullPath.toString() ) );
                setCommandEdit( {
                    commandIndex: null,
                    parameterIndex: null,
                    commandLetter: null,
                    parameter: null
                } )
            } }
            onChange={ changeEvent => setCommandEdit( {
                ...commandEdit,
                parameter: parseInt( changeEvent.target.value )
            } ) }
        /> ) }
    </div>;
};

export default function CommandsPanel() {

    const dispatch = useDispatch();

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
            { activePath.parsedCommands.map( parsedCommand => <CommandRow
                key={ parsedCommand.index }
                fullPath={ activePath }
                commandIndex={ parsedCommand.index }
                commandEdit={ commandEdit }
                setCommandEdit={ setCommandEdit }
                dispatch={ dispatch }
                dark={ dark }
            /> ) }
        </section> : <i>No path selected</i> }
    </div>;

}
