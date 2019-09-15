#!/usr/bin/python3

import sys
from FireEye import FireEye
from time import sleep
from json import loads as stringToDict
from driver import motors, MAX_SPEED
from imaging import vision

_b = lambda m: '{}{}{}'.format('\033[34m', m, '\033[0m')
_g = lambda m: '{}{}{}'.format('\033[32m', m, '\033[0m')
_r = lambda m: '{}{}{}'.format('\033[91m', m, '\033[0m') 

def report(cmd,  mag, rel=' set to '):
	print(_b(cmd), end='' if rel or mag else '\n')
	if rel is not None: print(rel, end='' if mag else '\n')
	if mag is not None: print(_g(mag))

def error(msg):
	print(_r(msg))

ESTOP     = 'estop'
STOP      = 'stop'
SPEED     = 'speed'
MOVE      = 'move'
MAG       = 'mag'
DRIFT     = 'drift'
DIRECTION = 'direction'
ACTION    = 'action'
TIME      = 'time'
TURN      = 'turn'
CMD       = 'cmd'

def scaleSpeed(speed):
	return (float(speed) / 100) * MAX_SPEED

class Robot():
	def __init__(self, socket):
		self.socket = socket
		# self.vision = vision(socket)
		self.motors = motors

	def run(self):
		while True:
			try:
				data = self.socket.get('instructions')
				if(data == None):
					continue
				self.socket.channels['instructions'] = None
				data = stringToDict(data)
				if data == 'QUIT':
					self.eStop()
					return
				self.interpret(data)
			except:
				error('Error encountered in main run loop.')
				continue

	def interpret(self, i):
		print(i)
		print(i[CMD])
		try:
			cmd = i[CMD]
			if  cmd == ESTOP: self.eStop()
			elif cmd == STOP: self.stop()
			elif cmd == MOVE: self.move(scaleSpeed(i[SPEED]))
			elif cmd == TURN: self.turn(scaleSpeed(i[SPEED]))
			elif cmd == DRIFT:
				speed, mag = i[SPEED], i[MAG]
				left = speed if i[direction] else speed * mag
				right = speed * mag if i[direction] else speed
				self.manual(left, right)
			elif cmd == ACTION:
				if i[ACTION] == 'nod': self.nod()
				if i[ACTION] == 'shake': self.shake()
				if i[ACTION] == 'panic': self.panic()
			if TIME in i.keys(): sleep(i[TIME])
			self.stop()
		except:
			error("Command Not Recognized: {}".format(cmd))
			self.stop()

	def move(self, speed):
		self.motors.motor1.setSpeed(-speed)
		self.motors.motor2.setSpeed(speed)
		report('Move', speed)

	def turn(self, speed):
		self.motors.motor1.setSpeed(-speed)
		self.motors.motor2.setSpeed(-speed)
		report('Turn', speed)

	def manual(self, left, right):
		self.motors.motor1.setSpeed(-left)
		self.motors.motor2.setSpeed(right)
		report('Manual', 'left:{}, right:{}'.format(left, right))

	def stop(self):
		self.motors.motor1.setSpeed(0)
		self.motors.motor2.setSpeed(0)
		report('Normal Stop', None)

	def eStop(self):
		self.motors.forceStop()
		report('Emergency Stop', None)

	def wiggle(self):
		for i in range(4):
			self.move(100 * (-1 if i % 2 else 1))
			time.sleep(0.3)
		self.stop()
		report('Performing Wiggle', None)

	def shake(self):
		for i in range(4):
			self.move(100 * (-1 if i % 2 else 1))
			time.sleep(0.3)
		self.stop()
		report('Performing Shake', None)

	def nod(self):
		for i in range(4):
			self.move(100 * (-1 if i % 2 else 1))
			time.sleep(0.3)
		self.stop()
		report('Performing Nod', None)

def main(god=False):
	socket = FireEye.FireEye(addr='192.168.137.158', port=8080)
	print("FireEye Connected")
	bot = Robot(socket)
	print("Robot about to run")
	bot.run()


if __name__ == '__main__':
	main()
