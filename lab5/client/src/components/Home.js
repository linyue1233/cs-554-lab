import React, { useState } from 'react';
import '../App.css';
import DeletePostModal from './DeletePostModal';
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
    const [deletePost, setDeletePost] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    let showData = null;

    const { loading: loading1, error: error1, data: unsplashData } = useQuery(querys.GET_UNSPLASHPOSTS, {
        variables: { pageNum },
        fetchPolicy: 'cache-first'
    });

    const { loading: loading2, error: error2, data: binData } = useQuery(querys.SHOW_MYBIN, {
        fetchPolicy: 'cache-and-network'
    });

    const { loading: loading3, error: error3, data: postData } = useQuery(querys.SHOW_MYPOST, {
        fetchPolicy: 'cache-and-network'
    });

    const [updateImage] = useMutation(querys.UPDATE_IMAGETWITHBIN);
    const [deleteImage] = useMutation(querys.DELETE_POST);

    const readMoreBtn = (count) => {
        setPageNum(count + pageNum);
    };

    const handleUnpdateBin = (singalPost) => {
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

    const handleCloseModals = () => {
        setShowDeleteModal(false);
    };

    const handleOpenDeleteModal = (singalPost) => {
        setShowDeleteModal(true);
        console.log(singalPost);
        setDeletePost(singalPost);
    };


    const buildPage = (imagePost) => {
        return (
            <div className='card textPost' key={imagePost.id}>
                <div className='card-body'>
                    <h5 className='card-title'>
                        Description:{imagePost.description}
                    </h5>
                    Author: {imagePost.posterName}
                    <br />
                    <CardMedia className='cardImg'
                        component='img'
                        image={
                            imagePost.url && imagePost.url
                        }
                        title='show image'
                    />
                    <div>
                        {!imagePost.binned && (
                            < button
                                className='button'
                                onClick={() => {
                                    handleUnpdateBin(imagePost);
                                }}
                            >
                                Add to Bin
                            </button>
                        )
                        }
                        {/* in bin */}
                        {imagePost.binned && (
                            < button
                                className='button'
                                onClick={() => {
                                    handleUnpdateBin(imagePost);
                                }}
                            >
                                Remove from Bin
                            </button>
                        )
                        }
                        {props.param == 3 && imagePost.posterName == 'benchMoon' &&
                            <button
                                className='button'
                                onClick={() => { handleOpenDeleteModal(imagePost) }}
                            >
                                Delete Image
                            </button>
                        }
                    </div>
                    {/* not in bin */}
                </div>
            </div>
        );
    }

    if (props.param == 1) {
        showData = unsplashData && unsplashData.unsplashImages.map((imagePost) => {
            return buildPage(imagePost);
        });
    } else if (props.param == 2) {
        showData = binData && binData.binnedImages.map((imagePost) => {
            return buildPage(imagePost);
        });
    } else {
        showData = postData && postData.userPostedImages.map((imagePost) => {
            return buildPage(imagePost);
        });
    }

    if ((props.param == 1 && unsplashData) || (props.param == 2 && binData) || (props.param == 3 && postData)) {
        return (
            <div>
                {showData}
                {
                    props.param == 1 &&
                    <Button variant="outlined" margin="0 auto" onClick={() => readMoreBtn(1)}>
                        Read More
                    </Button>
                }
                {showDeleteModal && showDeleteModal && (
                    <DeletePostModal
                        isOpen={showDeleteModal}
                        handleClose={handleCloseModals}
                        deleteImage={deletePost}
                    />
                )}
            </div>
        )
    } else if (loading1) {
        return <div>Loading</div>;
    } else if (error1) {
        return <div>{error1.message}</div>;
    }



}



export default Home;