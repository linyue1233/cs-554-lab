import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SearchShows from './SearchShows';
import noImage from '../img/download.jpeg';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  makeStyles
} from '@material-ui/core';
import PageHelper from './PageHelper';
import '../App.css';

const useStyles = makeStyles({
  card: {
    maxWidth: 250,
    height: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 5,
    border: '1px solid #1e8678',
    boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
  },
  titleHead: {
    borderBottom: '1px solid #1e8678',
    fontWeight: 'bold'
  },
  grid: {
    flexGrow: 1,
    flexDirection: 'row'
  },
  media: {
    height: '100%',
    width: '100%'
  },
  button: {
    color: '#1e8678',
    fontWeight: 'bold',
    fontSize: 12
  }
});

const ShowList = () => {
  const regex = /(<([^>]+)>)/gi;
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState(undefined);
  const [showsData, setShowsData] = useState(undefined);
  const [searchTerm, setSearchTerm] = useState('');

  const [upDisabled, setUpDisabled] = useState(false);
  const [downDisabled, setDownDisabled] = useState(false);
  const nagivate = useNavigate();
  const [notFound, setNotFound] = useState(false);
  const { pagenum } = useParams();
  const [showPage, setShowPage] = useState(true)
  let card = null;

  useEffect(() => {
    console.log('on load useeffect');
    async function fetchData() {
      try {
        const { data } = await axios.get('http://api.tvmaze.com/shows?page=' + pagenum);
        setShowsData(data);
        setLoading(true);
        setNotFound(false);
        setShowPage(true);
      } catch (e) {
        if(e.response.status === 404){
          setNotFound(true);
        }
      }finally {
        setLoading(false);
      }
    }
    if( +pagenum === 0){
      setUpDisabled(true);
    }else if(notFound) {
      setUpDisabled(true);
      setDownDisabled(true);
    }else{
      setUpDisabled(false);
      setDownDisabled(false);
    }
    if(+pagenum === 243){
      setDownDisabled(true);
    }
    fetchData();
  }, [pagenum]);

  useEffect(() => {
    console.log('search useEffect fired');
    async function fetchData() {
      try {
        console.log(`in fetch searchTerm: ${searchTerm}`);
        const { data } = await axios.get(
          'http://api.tvmaze.com/search/shows?q=' + searchTerm
        );
        setSearchData(data);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
    if (searchTerm) {
      console.log('searchTerm is set');
      fetchData();
      setShowPage(false);
    }else{
      setShowPage(true);
    }
  }, [searchTerm]);
  
  // monitor not found
  useEffect(() => {
    if(notFound) {
      setDownDisabled(true);
    }
  },[notFound]);

  const changedPage = count => nagivate(`/shows/page/${+pagenum + count}`);

  const searchValue = async (value) => {
    setSearchTerm(value);
  };
  const buildCard = (show) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={show.id}>
        <Card className={classes.card} variant='outlined'>
          <CardActionArea>
            <Link to={`/shows/${show.id}`}>
              <CardMedia
                className={classes.media}
                component='img'
                image={
                  show.image && show.image.original
                    ? show.image.original
                    : noImage
                }
                title='show image'
              />

              <CardContent>
                <Typography
                  className={classes.titleHead}
                  gutterBottom
                  variant='h6'
                  component='h3'
                >
                  {show.name}
                </Typography>
                <Typography variant='body2' color='textSecondary' component='p'>
                  {show.summary
                    ? show.summary.replace(regex, '').substring(0, 139) + '...'
                    : 'No Summary'}
                  <span>More Info</span>
                </Typography>
              </CardContent>
            </Link>
          </CardActionArea>
        </Card>
      </Grid>
    );
  };

  if (searchTerm) {
    card =
      searchData &&
      searchData.map((shows) => {
        let { show } = shows;
        return buildCard(show);
      });
  } else {
    card =
      showsData &&
      showsData.map((show) => {
        return buildCard(show);
      });
  };



  if (loading || notFound || pagenum <0) {
    return (
      <div>
        <h2>{loading ? 'Loading....' : '404 - your page not found'}</h2>
      </div>
    );
  } else {
    return (
      <div>
        <SearchShows searchValue={searchValue} />
        <br />
        <br />
        <Grid container className={classes.grid} spacing={5}>
          {card}
        </Grid>
        {/* add button for page */}
        {pagenum && showPage && <PageHelper upDisabled = {upDisabled} downDisabled = {downDisabled}  changedPage= {changedPage}></PageHelper>}
      </div>  
    );
  }
};

export default ShowList;
