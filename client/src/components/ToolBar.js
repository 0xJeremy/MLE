import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Toolbar from '@material-ui/core/Toolbar';

const StyledTabs = withStyles({
  indicator: {
  display: 'flex',
  justifyContent: 'center',
  backgroundColor: 'transparent',
    '& > div': {
      maxWidth: 50,
      width: '100%',
      backgroundColor: '#ffffff',
    },
  },
})(props => <Tabs {...props} TabIndicatorProps={{ children: <div /> }} />)

const StyledTab = withStyles(theme => ({
  root: {
    textTransform: 'none',
    color: '#fff',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(18),
    marginRight: theme.spacing(3),
    marginLeft: theme.spacing(3),
    '&:focus': {
      opacity: 1,
    },
  },
}))(props => <LinkTab disableRipple {...props} />);

function LinkTab(props) {
  return (
    <Tab
      component="a"
      onClick={event => {
        event.preventDefault();
      }}
      {...props}
    />
  );
}

function a11yProps(index) {
  return {
    id: `nav-tab-${index}`,
    'aria-controls': `nav-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
	name: {
		marginLeft: '-10px',
		fontSize: '2.2em',
		fontFamily: 'bookman'
	},
  title: {
    flexGrow: 1,
    borderColor: '#fff',
		borderStyle: 'solid',
		borderWidth: '0 0 0 2px',
		marginLeft: '64px',
  },
  hide: {
    display: 'none',
  },
  icon: {
    color: '#999999'
  }
}));

function ToolBar(props) {
	const classes = useStyles()
	const value = props.value;
	const handleChange = props.handleChange;

	return (
		<Toolbar>
			<Typography className={classes.name}>HackMIT 2019</Typography>
      <StyledTabs value={value} onChange={handleChange} aria-label="styled tabs" className={classes.title}>
        <StyledTab label="Dashboard" href="/Dashboard" {...a11yProps(0)} />
        <StyledTab label="Status Monitor" href="/status" {...a11yProps(1)} />
      </StyledTabs>
    </Toolbar>
	)
}

export default ToolBar
