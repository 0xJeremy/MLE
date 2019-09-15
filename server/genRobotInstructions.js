// genRobotInstructions.js
//
// Generates instructions for the robot
// 
module.exports = {
	
	genForward: function (speed = 50, time = 1) {
		const instruct = `{"cmd": "move", "speed": ${speed}, "time": ${time}}`;
		return instruct;
	},

	genBack: function (speed = -50, time = 1) {
		const instruct = `{"cmd": "move", "speed": ${speed}, "time": ${time}}`;
		return instruct;
	},

	genLeft: function (speed = -50, time = 1){
		const instruct = `{"cmd": "turn", "speed": ${speed}, "time": ${time}}`;
		return instruct;
	},

	genRight: function(speed = 50, time = 1){
		const instruct = `{"cmd": "turn", "speed": ${speed}, "time": ${time}}`;
		return instruct;
	},

	genStop: function(){
		const instruct = {"cmd": "stop"};
		return instruct;
	},

	genEStop: function(){
		const instruct = {"cmd": "estop"}
		return instruct;
	}
}