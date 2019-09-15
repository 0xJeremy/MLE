const GenRobotInstruct = require("./genRobotInstructions.js");

class GodMode {

	constructor(io, socket){
		this.io = io;
		this.socket = socket;
	}

	godControl(){
		this.io.on('connection', (ioSocket) => {
			ioSocket.on('manual', (data) => {

				console.log("Data: " + data);

				var direction = data['direction'];
				var duration = data['time']; //default 1s
				var speed = data['speed']; //default 50% speed

				var instruct;
				switch(direction) {
					case 'FORWARD':
						instruct = GenRobotInstruct.genForward(speed, duration);
						break;

					case 'BACK':
						instruct = GenRobotInstruct.genBack(speed, duration);
						break;

					case 'LEFT':
						instruct = GenRobotInstruct.genLeft(speed, duration);
						break;

					case 'RIGHT':
						instruct = GenRobotInstruct.genRight(speed, duration);
						break;

					case 'STOP':
						instruct = GenRobotInstruct.genStop();
						break;

					default:
						console.error('Invalid manual command sent to server!\n');
				}

				console.log("Instruction: " + instruct);

				this.socket.write('instructions', instruct);

			});
		});
	}
}

module.exports = GodMode;