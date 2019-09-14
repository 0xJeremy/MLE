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
	}
}));

function Loading() {
	const classes = useStyles();
	return (
		<div>
	    <Typography className={classes.type} variant="h3" gutterBottom>
		  	<br /><br />// searching for camera //
		  </Typography>
		  <LinearProgress className={classes.loading}/>
		  <br /><br />
	  </div>
	)
}

class Camera extends Component {
  constructor(props) {
    super();
    this.state = {
      img: false,
    };
    props.socket.on("image", data => this.setState({ img: data }));
  }

  render() {
  	return (
  		<Container maxWidth="sm">
				{this.state.img !== false &&
					<img id='img' alt='' src={"data:image/png;base64,"+this.state.img} />
				}
      	{this.state.img === false &&
      		<Loading />
      	}
    	</Container>
  	)
  } 
}

export default Camera;
