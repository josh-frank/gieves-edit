export default function Artboard( { width, height, shapes } ) {

    return <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width={ `${ width }px` }
        height={ `${ height }px` }
        viewBox={ `0 0 ${ width } ${ height }` }
        enableBackground={ `new 0 0 ${ width } ${ height }` }
    >
        { shapes.map( ( shape, index ) => {
            return <path
                key={ index }
                d={ shape }
                stroke="black"
                strokeWidth="4"
                fill="white"
            />;
        } ) }
    </svg>;

}