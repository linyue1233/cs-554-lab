import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import noImage from '../img/download.jpeg';
import SearchShows from './SearchShows';
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Grid,
    Typography,
    makeStyles
} from '@material-ui/core';
import '../App.css';
import PageHelper from './PageHelper';

const md5 = require('blueimp-md5');
const publicKey = 'ac349146568a40db88d7b56dc335b529';
const privateKey = '79136eb402abb855ea53fd605d6c589be54330d7';
const ts = new Date().getTime();
const stringToHash = ts + privateKey + publicKey;
const hash = md5(stringToHash);
const baseUrl = 'https://gateway.marvel.com:443/v1/public/characters';
const url = baseUrl + '?ts=' + ts + '&apikey=' + publicKey + '&hash=' + hash;
const suffix = '&ts=' + ts + '&apikey=' + publicKey + '&hash=' + hash;
const useStyles = makeStyles({
    card: {
        maxWidth: 550,
        height: 'auto',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 5,
        border: '1px solid #178577',
        boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
    },
    titleHead: {
        color: '#178577',
        borderBottom: '1px solid #178577',
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
        color: '#178577',
        fontWeight: 'bold',
        fontSize: 12
    }
});

const Characters = () => {
    const regex = /(<([^>]+)>)/gi;
    const nagivate = useNavigate();
    const classes = useStyles();
    const [loading, setLoading] = useState(true);
    const [showsData, setShowsData] = useState(undefined);
    const [searchData, setSearchData] = useState(undefined);
    const [searchTerm, setSearchTerm] = useState('');

    const [upDisabled, setUpDisabled] = useState(false);
    const [downDisabled, setDownDisabled] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(20);
    const [showPage, setShowPage] = useState(true)
    const { pageNum } = useParams();
    let card = null;

    const changedPage = count => {
        nagivate(`/characters/page/${+pageNum + count}`);
    }

    async function fetchData(pageNum) {
        try {
            const { data } = await axios.get(url + '&offset=' + pageNum * limit);
            let currentOffset = pageNum * limit;
            setOffset(currentOffset);
            setShowPage(true);
            if (currentOffset >= data.data.total || currentOffset < 0) {
                setNotFound(true);
            } else {
                if (currentOffset === 0) {
                    setUpDisabled(true);
                    setDownDisabled(false);
                } else if (currentOffset + limit >= data.data.total) {
                    setUpDisabled(false);
                    setDownDisabled(true);
                } else {
                    setUpDisabled(false);
                    setDownDisabled(false);
                }
                const results = data.data.results;
                setLoading(true);
                setShowsData(results);
                setNotFound(false);
            }
        } catch (e) {
            if (e.response.status === 404) {
                setNotFound(true);
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        console.log('change page');
        fetchData(pageNum);
    }, [pageNum])

    useEffect(() => {
        console.log('search character');
        async function fetchSearchData() {
            try {
                const { data } = await axios.get(baseUrl + '?nameStartsWith=' + searchTerm + suffix);
                let results = data.data.results;
                setSearchData(results);
                setLoading(false);
            } catch (e) {
                console.log(e);
            }
        }
        if (searchTerm) {
            console.log('searchTerm is set');
            fetchSearchData();
            setShowPage(false);
        } else {
            setShowPage(true);
        }
    }, [searchTerm])

    // monitor not found
    useEffect(() => {
        if (notFound) {
            setDownDisabled(true);
            setUpDisabled(true);
        }
    }, [notFound]);

    const searchValue = async (value) => {
        setSearchTerm(value);
    };

    const buildCard = (show) => {
        return (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={show.id}>
                <Card className={classes.card} variant='outlined'>
                    <CardActionArea>
                        {/* <Link to={`/characters/${show.id}`}> */}
                        <Link to={`/characters/${show.id}`}>
                            <CardMedia
                                className={classes.media}
                                component='img'
                                image={
                                    show.thumbnail && show.thumbnail.path
                                        ? show.thumbnail.path + '.' + show.thumbnail.extension
                                        : noImage
                                }
                                title='show image'
                            />

                            <CardContent>
                                <Typography
                                    className={classes.titleHead}
                                    gutterBottom
                                    variant='h6'
                                    component='h2'
                                >
                                    {show.name}
                                </Typography>
                                <Typography variant='body2' color='textSecondary' component='p'>
                                    {show.description
                                        ? show.description.replace(regex, '').substring(0, 139) + '...'
                                        : 'No Description'}
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
        card = searchData && searchData.map((show) => {
            return buildCard(show);
        });
    } else {
        card = showsData && showsData.map((show) => {
            return buildCard(show);
        });
    }


    if (loading || notFound || pageNum < 0) {
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
                {pageNum && showPage && <PageHelper upDisabled={upDisabled} downDisabled={downDisabled} changedPage={changedPage}></PageHelper>}
            </div>);
    }
}

export default Characters;