import React from 'react';
import '../App.css';

const Home = () => {
  return (
    <div>
      <p>
        This is a simple example of using React to Query the TV Maze API. Start
        by clicking the "Shows" button above
      </p>

      <p className='hometext'>
        The application queries two of TV Maze's end-points.
        For searching the shows in the API (Where SEARCH_TERM is what the user
        types into the search input)
      </p>
    </div>
  );
};

export default Home;
