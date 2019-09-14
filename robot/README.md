# Spark

## A robot platform.

### Instruction Specification

Format:
```
'action:	Description of action
	example_parameter: Parameter type
```

```
'move':		Moves the robot. Both wheels simultaneously in the same direction
	speed: int -100 to 100

'turn':		Moves both motors in opposite directions at the same speed
	speed: int -100 to 100 (negative values are counterclockwise, positive values are clockwise)

'stop':		Sets the speed of both motors to 0

'estop':	Sets the speed of both motors to 0 and reinitializes the GPIO library

'drift':	Sets the robot to move both motors according to a fast and slow speed.
			Uses a multiplier to determine these speeds.
			NOTE: Drifting only works going forward
	speed:		int 0 to 100 → The base speed for the faster motor
	mag: 		float 0 to 1 → The multiplier for the slower motor
	direction: 	0 to drift left, 1 to drift right

'action':	Executes a preset action
	action: ['nod', 'shake', 'panic']
```
All actions can have an additional `time` parameter:
```
This parameter indicates how long the action is to be performed.
Does not apply to preset actions. Time is measured in seconds.
	'time': float >= 0
```

### Instruction Format:
All instructions must be in JSON dictionary form.
Example instructions:
```
{"cmd": "move", "speed": 50, "time": 1}

{"cmd": "stop"}

{"cmd": "drift", "speed": 50, "mag": 0.9, "direction": 0}

{"cmd": "action", "action": "nod"}
```

#### CAUTION: Error checking is not present. Malformed requests will be ignored.