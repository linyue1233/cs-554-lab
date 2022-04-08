import React, { useState } from 'react';
import '../App.css';
import { gql, useQuery, useMutation } from '@apollo/client';
import querys from '../querys';
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Grid,
    Typography,
    makeStyles,
    Button
} from '@material-ui/core';

function Home(props) {
    const [pageNum, setPageNum] = useState(0);

    const { loading, error, data } = useQuery(querys.GET_UNSPLASHPOSTS, {
        variables: { pageNum },
        fetchPolicy: 'cache-and-network'
    });

    const { loading: loading1, error: error1, data: binData } = useQuery(querys.SHOW_MYBIN, {
        fetchPolicy: 'cache-and-network'
    });

    const [updateImage] = useMutation(querys.UPDATE_IMAGETWITHBIN);


    const readMoreBtn = (count) => {
        setPageNum(count + pageNum);
    };

    const handleUnpdateBin = (singalPost) => {
        console.log(singalPost);
        updateImage({
            variables: {
                id: singalPost.id,
                url: singalPost.url,
                posterName: singalPost.posterName, 
                description: singalPost.description,
                binned: !singalPost.binned,
                userPosted: singalPost.userPosted
            }
        })
    };

    if (props.param == 1 && data) {
        const { unsplashImages } = data;
        return (
            <div>
                {unsplashImages.map((unsplashImage) => {
                    return (
                        <div className='card textPost' key={unsplashImage.id}>
                            <div className='card-body'>
                                <h5 className='card-title'>
                                    Description:{unsplashImage.description}
                                </h5>
                                Author: {unsplashImage.posterName}
                                <br />
                                <CardMedia className='cardImg'
                                    component='img'
                                    image={
                                        unsplashImage.url && unsplashImage.url
                                    }
                                    title='show image'
                                />
                                {/* not in bin */}
                                {!unsplashImage.binned && (
                                    < button
                                        className='button'
                                        onClick={() => {
                                            handleUnpdateBin(unsplashImage);
                                        }}
                                    >
                                        Add to Bin
                                    </button>
                                )
                                }
                                {/* in bin */}
                                {/* {unsplashImage.binned && (
                                    < button
                                        className='button'
                                        onClick={() => {
                                            handleUnpdateBin(unsplashImage);
                                        }}
                                    >
                                        Remove from Bin
                                    </button>
                                )
                                } */}

                                <br />
                            </div>
                        </div>
                    );
                })}
                <Button variant="outlined" margin="0 auto" onClick={() => readMoreBtn(1)}>
                    Read More
                </Button>
            </div>
        )
    } else if (loading) {
        return <div>Loading</div>;
    } else if (error) {
        return <div>{error.message}</div>;
    }

}



export default Home;