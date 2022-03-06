import Reaact,{Component} from 'react';

class Clock extends Component {

    constructor(props) {
        super(props);
        this.state = {
            date: this.props.date,
            counter: 0
        };
    }
    
    componentDidMount() {
        this.timerId = setInterval(() =>{
            this.tick();
        },1000);
    }


    componentWillUnmount(){
        clearInterval(this.timerId);
    }

    tick() {
        this.setState((state,props) =>({
            date: new Date(),
            count: state.counter+1
        }))
    }

    render(){
        return (
            <div>
                <h2>It is :{this.state.date.toLocaleTimeString()}</h2>
                <h2>{this.state.counter}</h2>
            </div>
        )
    }
}


export default Clock