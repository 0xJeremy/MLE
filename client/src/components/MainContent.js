import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Dashboard from './Dashboard';
import socketIOClient from "socket.io-client";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      <Box p={1}>{children}</Box>
    </Typography>
  );
};

const useStyles = makeStyles(theme => ({
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  },
  tab: {
    backgroundColor: '#000',
    color: '#fff',
    fontSize: '1.5rem',
  }
}));

function MainContents(props) {
	const classes = useStyles();
	const value = props.value;

  const socket = socketIOClient();

	return (
		<div>
			<div className={classes.drawerHeader} />
      <TabPanel value={value} index={0} className={classes.tab}>
        <Dashboard socket={socket}/>
      </TabPanel>

      <TabPanel value={value} index={1} className={classes.tab}>
      // coming soon: a robot status monitor //
      </TabPanel>

    </div>
	);
}

export default MainContents;
