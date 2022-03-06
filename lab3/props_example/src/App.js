import logo from './logo.svg';
import './App.css';

function App() {
  const greeting = "Here yeue";
  const handle_func=  ()=>{
    console.log("Yue Lin");
  }
  return (
    <div className="App">
      <PropsExample user={{name:'JieXu', username :'benchMoon'}}
      greeting= {greeting}
      handleFunc = {handle_func}/>
    </div>
  );
}

export default App;
