import logo from './logo.svg';
import './App.css';

function PropsExample(props) {
    let h1 = null;
    if( props.greeting){
        h1 = <h1>{props.greeting}</h1>;
    }else{
        h1 = <h1>Here is</h1>
    }
    return <div>
        {h1}
        <h2>{props.user.name}</h2>
        <button onClick = {props.handleFunc}></button>
    </div>;
}