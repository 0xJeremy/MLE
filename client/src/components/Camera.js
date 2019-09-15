import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles(theme => ({
	type: {
	},
	loading: {
		backgroundColor: '#000'
	},
	height: {
		height: '480px'
	}
}));

function Loading() {
	const classes = useStyles();
	return (
		<div>
	    <Typography className={classes.type} variant="h3" gutterBottom>
		  	<br /><br /><br />// seeking camera //
		  </Typography>
		  <LinearProgress className={classes.loading}/>
	  </div>
	)
}

function Camera(props) {
	const classes = useStyles();
	const rNum = props.rNum;
	const socket = props.socket;
	const [img, setImg] = React.useState(false);

	socket.on('image'+rNum, (data) => {
		setImg(data);
	});

	return (
  	<Container className={classes.height} maxWidth="sm">
			{img !== false &&
				<img id='img' alt='' src={"data:image/png;base64,"+img} />
			}
     	{img === false &&
     		<Loading />
     	}
    </Container>
  )
}

export default Camera;
