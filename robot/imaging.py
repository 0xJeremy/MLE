from threading import Thread
from FireEye import FireEye
import cv2
import base64

class vision(Thread):
	def __init__(self, socket):
		super(vision, self).__init__()
		self.socket = socket
		self.cap = cv2.VideoCapture(0)
		self.cap.set(3, 640)
		self.cap.set(4, 480)
		self.capture = True
		self.sendImg = True
		self.endThread = False
		self.run()

	def run(self):
		while True:
			if self.capture:
				ret, frame = self.cap.read()
				if self.sendImg:
					self.socket.writeImg(self.encodeImg(frame))
				self.sendImg = not self.sendImg
			if self.endThread:
				return

	def setCapture(self, state):
		self.capture = state

	def encodeImg(self, img):
		success, encoded_img = cv2.imencode('.jpg', img)
		return base64.b64encode(encoded_img)

	def exit(self):
		self.endThread = True
