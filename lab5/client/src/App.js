import {NavLink, BrowserRouter as Router, Route} from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import MyBin from './components/MyBin';
import MyPosts from './components/MyPosts';
import NewPost from './components/NewPost';
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider
} from '@apollo/client';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:4000'
  })
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div>
          <header className='App-header'>
            <h1 className='App-title'>
              This is Binterest website!
            </h1>
            <nav>
              <NavLink className='navlink' to='/'>
                Home
              </NavLink>
              <NavLink className='navlink' to='/my-bin'>
                my-bin
              </NavLink>

              <NavLink className='navlink' to='/my-posts'>
                my-post
              </NavLink>
              <NavLink className='navlink' to='/new-post'>
                new-post
              </NavLink>
            </nav>
          </header>
          <Route exact path='/' render={()=><Home param={1}/>}></Route>
          <Route exact path='/my-bin' render={()=><Home param={2}/>}></Route>
          <Route exact path='/my-posts' render={()=><Home param={3}/>}></Route>
          <Route path='/new-post' component={NewPost}></Route>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
