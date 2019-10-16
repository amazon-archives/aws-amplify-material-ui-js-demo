import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';
import StoreIcon from '@material-ui/icons/Store';
import LocalDrinkIcon from '@material-ui/icons/LocalDrink';
import ReplayIcon from '@material-ui/icons/Replay';
import NoteAddIcon from '@material-ui/icons/NoteAdd';

import Amplify, { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react'
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import Ctrl from "./Ctrl";

import {createOrder, reset} from "./API";

Amplify.configure(awsconfig);

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
}));

function App() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false
  });

  const logout = async () => {
    await Auth.signOut();
  };

  const toggleDrawer = (side, open) => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ ...state, [side]: open });
  };

  function handleListItemClick(role) {
    window.location.href = `/?role=${role}`
  }

  async function resetDemo() {
    console.log('reset the demo');

    await reset();
  }

  async function createAnOrder() {
    console.log('creat an order');

    await createOrder();
  }

  const sideList = side => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(side, false)}
      onKeyDown={toggleDrawer(side, false)}
    >
      <List>
        <ListItem button key={"host"} onClick={event => handleListItemClick("host")}>
          <ListItemIcon><PermContactCalendarIcon/></ListItemIcon>
          <ListItemText primary={"Host"} />
        </ListItem>
        <ListItem button key={"manufacturer"} onClick={event => handleListItemClick("manufacturer")}>
          <ListItemIcon><LocalDrinkIcon /></ListItemIcon>
          <ListItemText primary={"Manufacturer"} />
        </ListItem>
        <ListItem button key={"shipping"} onClick={event => handleListItemClick("shipping")}>
          <ListItemIcon><LocalShippingIcon /></ListItemIcon>
          <ListItemText primary={"Shipping"} />
        </ListItem>
        <ListItem button key={"retailer"} onClick={event => handleListItemClick("retailer")}>
          <ListItemIcon><StoreIcon /></ListItemIcon>
          <ListItemText primary={"Retailer"} />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button key={"Order"} onClick={event => createAnOrder()}>
          <ListItemIcon><NoteAddIcon /></ListItemIcon>
          <ListItemText primary={"Create an order"} />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button key={"Reset"} onClick={event => resetDemo()}>
          <ListItemIcon><ReplayIcon /></ListItemIcon>
          <ListItemText primary={"Reset"} />
        </ListItem>
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={toggleDrawer('left', true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            WAIC Smart Cafe
          </Typography>
          <Button color="inherit" onClick={logout}>Sign Out</Button>
        </Toolbar>
      </AppBar>
      <SwipeableDrawer
        open={state.left}
        onClose={toggleDrawer('left', false)}
        onOpen={toggleDrawer('left', true)}
      >
        {sideList('left')}
      </SwipeableDrawer>
      <Ctrl />
    </div>
  );
}

const signUpConfig = {
  defaultCountryCode: "86",
  usernameAttributes: "email",
  hiddenDefaults: ["username", "phone_number", "email"],
  signUpFields: [
    {
      label: 'Email',
      key: 'username',
      required: true,
      displayOrder: 1,
      type: 'string'
    },
    {
      label: 'Password',
      key: 'password',
      required: true,
      displayOrder: 2,
      type: 'password'
    }
  ]
};

export default withAuthenticator(App, { signUpConfig });
