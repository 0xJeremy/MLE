from driver import motors, MAX_SPEED
from time import sleep

SPEED = 300
TIMEOUT = 0.1

def forward():
	motors.motor1.setSpeed(-SPEED)
	motors.motor2.setSpeed(SPEED)

def backward():
	motors.motor1.setSpeed(SPEED)
	motors.motor2.setSpeed(-SPEED)

def left():
	motors.motor1.setSpeed(-SPEED)
	motors.motor2.setSpeed(-SPEED)
	sleep(TIMEOUT)
	stop()

def right():
	motors.motor1.setSpeed(SPEED)
	motors.motor2.setSpeed(SPEED)
	sleep(TIMEOUT)
	stop()

def stop():
	motors.motor1.setSpeed(0)
	motors.motor2.setSpeed(0)

def run():
	while(True):
		x = input()
		if x == 'w': forward()
		elif x == 's': backward()
		elif x == 'a': left()
		elif x == 'd': right()
		elif x == 'p': stop()

run()