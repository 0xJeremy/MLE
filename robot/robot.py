#!/usr/bin/python3

import sys
from FireEye import FireEye
from imaging import vision
from time import sleep

_b = lambda m: '{}{}{}'.format('\033[34m', m, '\033[0m')
_g = lambda m: '{}{}{}'.format('\033[32m', m, '\033[0m')

def report(cmd,  mag, rel=' set to '):
	print(_b(cmd), end='' if rel or mag else '\n')
	if rel is not None: print(rel, end='' if mag else '\n')
	if mag is not None: print(_g(mag))

ESTOP     = 'estop'
STOP      = 'stop'
SPEED     = 'speed'
MOVE      = 'move'
MAG       = 'mag'
DRIFT     = 'drift'
DIRECTION = 'direction'
ACTION    = 'action'
TIME      = 'time'
CMD       = 'cmd'

def scaleSpeed(speed):
	return (float(speed) / 100) * MAX_SPEED

class Robot():
	def __init__(self, socket, camera=True, god=False):
		if socket is not None:
			self.socket = socket
		if camera:
			self.vision = vision(socket)
		self.motors = motors
		self.god = god

	def run(self):
		while True:
			if not self.god:
				data = self.socket.get('instructions')
			else:
				data = HandOfGod.get()
				if data == 'QUIT':
					self.eStop()
					return
			self.interpret(data)

	def interpret(self, i):
		try:
			cmd = i[CMD]
			if cmd == ESTOP: self.eStop()
			elif cmd == STOP: self.stop()
			elif cmd == MOVE: self.move(scaleSpeed(i[SPEED]))
			elif cmd == TURN: self.turn(scaleSpeed(i[SPEED]))
			elif cmd == DRIFT:
				speed, mag = i[SPEED], i[MAG]
				left = speed if i[direction] else speed * mag
				right = speed * mag if i[direction] else speed
				self.manual(left, right)
			if TIME in i.keys(): sleep(i[TIME])
		except:
			print("We have errors")
			print(i)
		finally: self.stop()

	def move(self, speed):
		self.motors.motor1.setSpeed(speed)
		self.motors.motor2.setSpeed(speed)
		report('Move', speed)

	def turn(self, speed):
		self.motors.motor1.setSpeed(speed)
		self.motors.motor2.setSpeed(-speed)
		report('Turn', speed)

	def manual(self, left, right):
		self.motors.motor1.setSpeed(left)
		self.motors.motor2.setSpeed(right)
		report('Manual', 'left:{}, right:{}'.foramt(left, right))

	def stop(self):
		self.motors.motor1.setSpeed(0)
		self.motors.motor2.setSpeed(0)

	def eStop(self):
		self.motors.forceStop()
		report('Emergency Stop', True)

	def wiggle(self):
		for i in range(4):
			self.move(100 * (-1 if i % 2 else 1))
			time.sleep(0.3)
		self.stop()
		report('Performing Wiggle', None)

def main(god=False):
	if god:
		bot = Robot(socket=None, camera=False, god=True)

	else:
		socket = FireEye.FireEye()
		bot = Robot(socket, camera=True)

	bot.run()


if __name__ == '__main__':
	if sys.argv[1] == 'sim':
		from sim import motors, MAX_SPEED
	else:
		from driver import motors, MAX_SPEED

	if sys.argv[1] == 'god' or sys.argv[2] == 'god':
		from hog import HandOfGod
		main(True)
	else:
		main()
