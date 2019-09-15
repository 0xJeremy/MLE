import cv2
from threading import Thread

class vision(Thread):
	def __init__(self, socket):
		super(vision, self).__init__()
		self.socket = socket
		self.camera = cv2.VideoCapture(0)
		self.camera.set(4, 640)
		self.camera.set(4, 480)
		self.count = 0
		print("About to start thread")
		self.start()

	def run(self):
		while(True):
			ret, frame = self.camera.read()
			if self.count % 2:
				img = cv2.flip(frame, 0)
				self.socket.writeImg(img)
			self.count += 1