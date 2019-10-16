import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import {amber, green} from "@material-ui/core/colors"
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import LinearProgress from '@material-ui/core/LinearProgress';

import { requestShipping, startShipping, finishOrder, changeStage } from "./API.js"

const useStyles = makeStyles({
  card: {
    maxWidth: 345,
    margin: 30
  },
  media: {
    height: 0,
    paddingTop: '56.25%'
  },
  root: {
    flexGrow: 1
  }
});

export default function Ctrl() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [inProgress, setInProgress] = React.useState(false);
  const urlParams = new URLSearchParams(window.location.search);
  const role = urlParams.get('role');

  const requestShippingAPI = async () => {
    if (!inProgress) {
      setInProgress(true)
    }
    console.log('request shipping');
    await requestShipping();
    setInProgress(false)
  };

  const startShippingAPI = async () => {
    if (!inProgress) {
      setInProgress(true)
    }
    console.log('start shipping');
    await startShipping();
    setInProgress(false)
  };

  const finishOrderAPI = async () => {
    if (!inProgress) {
      setInProgress(true)
    }
    console.log('accept order');
    await finishOrder();
    setInProgress(false)
  };

  const CardView = ({ role }) =>  (
    <Grid container justify={"center"}>

      <Card className={classes.card}>
        <div className={classes.root}>
          <LinearProgress hidden={!inProgress}/>
        </div>
        <CardMedia
          className={classes.media}
          image={(()=> {
            if (role && role.name === "host") {
              return "/static/images/host.png"
            } else if (role && role.name === "manufacturer") {
              return "/static/images/manufacturer.png"
            } else if (role && role.name === "shipping") {
              return "/static/images/shipping.png"
            } else if (role && role.name === "retailer") {
              return "/static/images/retailer.png"
            }
          })()}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            WAIC Smart Cafe
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Click the button to start your action.
          </Typography>
        </CardContent>
        <CardActions>
          {(() => {
            if (role && role.name === "manufacturer") {
              return (
                <Button variant="contained" size="large" color="primary" onClick={requestShippingAPI}>
                  Request to Ship
                </Button>
              )
            } else if (role && role.name === "shipping") {
              return (
                <Button variant="contained" size="large" color="primary" onClick={startShippingAPI}>
                  Start Shipping
                </Button>
              )
            } else if (role && role.name === "retailer") {
              return (
                <Button variant="contained" size="large" color="primary" onClick={finishOrderAPI}>
                  Accept Drinks
                </Button>
              )
            }
          })()}
        </CardActions>
      </Card>
    </Grid>
  );

  /**
   * Host View
   * @returns {*}
   * @constructor
   */
  const HostView = () => (
    <Grid container justify={"center"}>
      <Card className={classes.card}>
        <CardMedia
          className={classes.media}
          image="/static/images/host.png"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            WAIC Smart Cafe - Host
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Click the following button to change stage
          </Typography>
        </CardContent>
        <CardActions>
          <Button variant="contained" size="large" color="primary" onClick={async () => {await changeStage("1")}}>
            Intro
          </Button>
          <Button variant="contained" size="large" color="primary" onClick={async () => {await changeStage("2")}}>
            Demo
          </Button>
          <Button variant="contained" size="large" color="primary" onClick={async () => {await changeStage("3")}}>
            Summary
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );

  const useStyles1 = makeStyles(theme => ({
    success: {
      backgroundColor: green[600],
    },
    error: {
      backgroundColor: theme.palette.error.dark,
    },
    info: {
      backgroundColor: theme.palette.primary.main,
    },
    warning: {
      backgroundColor: amber[700],
    },
    icon: {
      fontSize: 20,
    },
    iconVariant: {
      opacity: 0.9,
      marginRight: theme.spacing(1),
    },
    message: {
      display: 'flex',
      alignItems: 'center',
    },
  }));

  const variantIcon = {
    success: CheckCircleIcon
  };

  function MySnackbarContentWrapper(props) {
    const classes = useStyles1();
    const { className, message, onClose, variant, ...other } = props;
    const Icon = variantIcon[variant];

    return (
      <SnackbarContent
        className={clsx(classes[variant], className)}
        aria-describedby="client-snackbar"
        message={
          <span id="client-snackbar" className={classes.message}>
          <Icon className={clsx(classes.icon, classes.iconVariant)} />
            {message}
        </span>
        }
        {...other}
      />
    );
  }

  MySnackbarContentWrapper.propTypes = {
    className: PropTypes.string,
    message: PropTypes.string,
    onClose: PropTypes.func,
    variant: PropTypes.oneOf(['error', 'info', 'success', 'warning']).isRequired,
  };

  function handleClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  }

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
      >
        <MySnackbarContentWrapper
          variant="success"
          message="Success!"
          onClose={handleClose}
        />
      </Snackbar>
      {(() => {
        if (role === "host") {
          return <HostView />
        } else {
          return <CardView role={{name: role}} />
        }
      })()}
    </div>
  );
}
