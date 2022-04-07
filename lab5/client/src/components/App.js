import {NavLink, BrowserRouter as Router, Route} from 'react-router-dom';
import './App.css';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  HttpLink,
  gql
} from "@apollo/client";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:4000'
  })
});

function App() {
  return (
    <ApolloClient client={client}>
      <Router>
        <div>
          <header className='App-header'>
            <h1 className='App-title'>
              This is Binterest website!
            </h1>
            <nav>
              <NavLink className='navlink' to='/'>
                /Home
              </NavLink>
              <NavLink className='navlink' to='/my-bin'>
                /my-bin
              </NavLink>

              <NavLink className='navlink' to='/my-posts'>
                /my-post
              </NavLink>
              <NavLink className='navlink' to='/new-post'>
                /new-post
              </NavLink>
            </nav>
          </header>
          <Route path='/' component={Home}></Route>
          <Route path='/my-bin' component={MyBin}></Route>
          <Route path='/my-posts' component={MyPosts}></Route>
          <Route path='/new-post' component={NewPost}></Route>
        </div>
      </Router>
    </ApolloClient>
  );
}

export default App;
