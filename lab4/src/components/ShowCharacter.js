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
        border: '1px solid #178577',
        boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
    },
    titleHead: {
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

const md5 = require('blueimp-md5');
const publicKey = 'ac349146568a40db88d7b56dc335b529';
const privateKey = '79136eb402abb855ea53fd605d6c589be54330d7';
const ts = new Date().getTime();
const stringToHash = ts + privateKey + publicKey;
const hash = md5(stringToHash);
const baseUrl = 'https://gateway.marvel.com:443/v1/public/characters';
const suffix = '?ts=' + ts + '&apikey=' + publicKey + '&hash=' + hash;

const ShowCharacter = (props) => {
    const [showData, setShowData] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const classes = useStyles();
    let { characterId } = useParams();

    const tConvert = (time) => {
        // Check correct time format and split into components
        time = time
            .toString()
            .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

        if (time.length > 1) {
            // If time format correct
            time = time.slice(1); // Remove full string match value
            time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
            time[0] = +time[0] % 12 || 12; // Adjust hours
        }
        return time.join(''); // return adjusted time or original string
    };
    const formatDate = (showdate) => {
        var year = showdate.substring(0, 4);
        var month = showdate.substring(5, 7);
        var day = showdate.substring(8, 10);
        return month + '/' + day + '/' + year;
    };

    useEffect(() => {
        console.log('load singal character');
        let reg = /^[0-9]*$/;
        if (!reg.test(characterId)) {
            console.log(characterId);
            setNotFound(true);
            setLoading(false);
            return;
        }
        async function fetchData() {
            try {
                const { data } = await axios.get(baseUrl + '/' + characterId + suffix);
                console.log(data.data.results[0]);
                setShowData(data.data.results[0]);
                setLoading(false);
            } catch (e) {
                console.log(e);
            }
        }
        fetchData();
    }, [characterId]);

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
                <CardHeader className={classes.titleHead} title={showData.name} />
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
                <cardContent>
                    <Typography ariant="body2" color="textSecondary" component="span">
                        {showData.description
                            ? showData.description.replace(regex, '').substring(0, 139) + '...'
                            : 'No Description'}
                        <span>More Info</span>
                        <br></br>
                    </Typography>
                    {/* show responding comics */}
                    <Typography variant="body2" color="textSecondary" component="span">
                        <p>
                            <dt className={classes.titleHead} key="comics">
                                Comics:
                            </dt>
                        </p>
                        {showData.comics.items.length !== 0 ? (
                            <ul>
                                {showData.comics.items.map((show) => {
                                    let tempIndex = show.resourceURI.match('comics/').index;
                                    let comicId = show.resourceURI.substring(tempIndex + 7);
                                    return (
                                        <li>
                                            <Link className={classes.titleHead} to={`/comics/${comicId}`}>{show.name}</Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (<dd>No comics</dd>)}
                        <br></br>
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="span">
                        <p>
                            <dt className={classes.titleHead} key="series">
                                Series:
                            </dt>
                        </p>
                        {showData.series.items.length !== 0 ? (
                            <ul key="series">
                                {showData.series.items.map((show) => {
                                    let tempIndex = show.resourceURI.match('series/').index;
                                    let serieId = show.resourceURI.substring(tempIndex + 7);
                                    return (
                                        <li>
                                            <Link className={classes.titleHead} to={`/series/${serieId}`}>{show.name}</Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <dd>
                                No series
                            </dd>
                        )}
                        <br></br>
                    </Typography>
                    <Link to='/characters/page/0'>Back to all characters</Link>
                </cardContent>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
            </Card>
        );
    }
};


export default ShowCharacter;