import { Box, Button } from '@material-ui/core';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
}));

const PageHelper = (props) => {
    const classes = useStyles();
    return (
        <Box
            style={{
                // pinned bottom
                position: 'fixed',
                display: 'flex',
                bottom: 0,
                width: "100%",
                height: "5%",
                padding: '0 30px',
                boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                background: "#757de8"
            }}
        >
            <div className={classes.root}>
                {!props.upDisabled &&
                    <Button variant="outlined"
                        color="5f0000"
                        margin="0 auto"
                        disabled={props.upDisabled}
                        onClick={() => props.changedPage(-1)}
                    >
                        Previous
                    </Button>
                }
                {!props.downDisabled && <Button variant="outlined"
                    color="5f0000"
                    disabled={props.downDisabled}
                    onClick={() => props.changedPage(1)}
                    >
                    Next
                </Button>
                }

            </div>

        </Box>
    )
}

export default PageHelper;