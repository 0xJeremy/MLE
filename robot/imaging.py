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
		self.start()

	def run(self):
		while(True):
			try:
				ret, frame = self.camera.read()
				if self.count % 2:
					self.socket.writeImg(frame)
				count += 1
			except:
				continue
