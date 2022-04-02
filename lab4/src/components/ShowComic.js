import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import noImage from '../img/download.jpeg';
import {
    makeStyles,
    Card,
    CardContent,
    CardMedia,
    Typography,
    CardHeader
} from '@material-ui/core';
import '../App.css';
const useStyles = makeStyles({
    card: {
        maxWidth: 550,
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

const md5 = require('blueimp-md5');
const publicKey = 'ac349146568a40db88d7b56dc335b529';
const privateKey = '79136eb402abb855ea53fd605d6c589be54330d7';
const ts = new Date().getTime();
const stringToHash = ts + privateKey + publicKey;
const hash = md5(stringToHash);
const baseUrl = 'https://gateway.marvel.com:443/v1/public/comics';
const suffix = '?ts=' + ts + '&apikey=' + publicKey + '&hash=' + hash;

const ShowComic = (props) => {
    const [showData, setShowData] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const classes = useStyles();
    let { comicId } = useParams();

    useEffect(() => {
        // judge the route
        let reg = /^[0-9]*$/;
        if (!reg.test(comicId)) {
            console.log(comicId);
            setNotFound(true);
            setLoading(false);
            return;
        }
        console.log('load singal character');
        async function fetchData() {
            try {
                const { data } = await axios.get(baseUrl + '/' + comicId + suffix);
                console.log(data.data.results[0]);
                setShowData(data.data.results[0]);
                setLoading(false);
            } catch (e) {
                console.log(e);
            }
        }
        fetchData();
    }, [comicId]);

    let description = null;
    const regex = /(<([^>]+)>)/gi;
    if (showData && showData.description) {
        description = showData && showData.description.replace(regex, '');
    } else {
        description = 'No description';
    }
    if(notFound){
        return (
            <div>
                <h2>{'404 - your page not found'}</h2>
            </div>
        )
    }


    if (loading) {
        return (
            <div>
                <h2>Loading....</h2>
            </div>
        );
    } else {
        return (
            <Card className={classes.card} variant='outlined'>
                <CardHeader className={classes.titleHead} title={showData.title} />
                <CardMedia
                    className={classes.media}
                    component='img'
                    image={
                        showData.thumbnail && showData.thumbnail.path
                            ? showData.thumbnail.path + '.' + showData.thumbnail.extension
                            : noImage
                    }
                    title='show image'
                />
                <Typography>
                    {showData.description
                        ? 'Description: ' + showData.description.replace(regex, '').substring(0, 139) + '...'
                        : 'No Description'}
                    <span>More Info</span>
                    <br></br>
                    <Link to='/comics/page/0'>Back to all comics</Link>
                </Typography>
            </Card>

        );
    }
};


export default ShowComic;