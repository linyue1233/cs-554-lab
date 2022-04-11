import React, { useEffect, useState } from 'react';
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
        width: '500px',
        height: '380px',
        marginRight: '10px'
    },
    button: {
        color: 'green',
        fontWeight: 'bold',
        fontSize: 12
    }
});

function Home(props) {
    const [pageNum, setPageNum] = useState(1);
    const [deletePost, setDeletePost] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const classes = useStyles();
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

    const readMoreBtn = () => {
        setPageNum(1 + pageNum);
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
        setDeletePost(singalPost);
    };

    const buildPage = (imagePost) => {
        return (
            <ul key={imagePost.id}>
            <div className='card' key={imagePost.id}>
                <div className='card-body'>
                    <h5 className='card-title'>
                        Description:{imagePost.description}
                    </h5>
                    Author: {imagePost.posterName}
                    <br />
                    <CardMedia className={classes.media}
                        component='img'
                        image={
                            imagePost.url && imagePost.url
                        }
                        title='show image'
                    />
                    <div>
                        {!imagePost.binned && (
                            < button className="btn btn-primary"
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
                            < button className="btn btn-secondary"
                                onClick={() => {
                                    handleUnpdateBin(imagePost);
                                }}
                            >
                                Remove from Bin
                            </button>
                        )
                        }
                        {props.param == 3 && imagePost.posterName == 'benchMoon' &&
                            <button className="btn btn-danger"
                                onClick={() => { handleOpenDeleteModal(imagePost) }}
                            >
                                Delete Image
                            </button>
                        }
                    </div>
                    {/* not in bin */}
                </div>
            </div>
            </ul>

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
                {props.param == 3 &&
                    <Button variant="outlined" margin="0 auto"
                        className='button'>
                        <a href="/new-post">New Post</a>
                    </Button>}
                {/* <Grid container className={classes.grid} spacing={8}> */}
                <br></br>
                <br></br>
                <br></br>
                {props.param == 2 && binData && binData.binnedImages.length === 0 && <p>There are no binned images, you can add now.</p>}
                {props.param == 3 && postData && postData.userPostedImages.length === 0 && <p>You haven't posted yet. Post your fisting image!</p>}
                <div className="container" >
                    {showData}
                </div>
                {/* </Grid> */}
                <br></br>
                <br></br>
                {
                    props.param == 1 &&<div className="text-center ">
                    <button className="btn btn-info btn-lg " margin="100 auto" onClick={() => readMoreBtn(1)}>
                        Read More
                    </button>
                    </div>

                }
                                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>

                {showDeleteModal && showDeleteModal && (
                    <DeletePostModal
                        isOpen={showDeleteModal}
                        handleClose={handleCloseModals}
                        deleteImage={deletePost}
                    />
                )}
            </div>
        )
    } else if ((props.param == 1 && loading1) || (props.param == 2 && loading2) || ((props.param == 3 && loading3))) {
        return <div>Loading</div>;
    } else if ((props.param == 1 && error1) || (props.param == 2 && error2) || (props.param == 3 && error3)) {
        return <div>{error1.message || error2.message || error3.message}</div>;
    }
}

export default Home;