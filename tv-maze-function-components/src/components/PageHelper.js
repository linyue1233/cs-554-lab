import { Box,Button } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { createMuiTheme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
});
const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(2),
      },
    },
  }));

const PageHelper = (props) => {
    const classes = useStyles();
    return(
        <Box
            style = {{
                // pinned bottom
                position: 'fixed',
                display: 'flex',
                bottom:0,
                width: "100%",
                height:"5%",
                padding: '0 30px',
                boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                background: "#757de8"
            }}
        >
            <div className = {classes.root}>
            <Button variant="outlined"
                    color="secondary"
                    margin="0 auto"
                    disabled={props.upDisabled}
                     onClick={()=>props.changedPage(-1)}
            >
                Previous
            </Button>
            <Button variant="outlined"
                    color="secondary"
                    disabled={props.downDisabled}
                    onClick={()=>props.changedPage(1)}
            >
                Next
            </Button>
            </div>
            
        </Box>
    )
}

export default PageHelper;