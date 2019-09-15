#!/usr/bin/python3

import sys
import cv2
from FireEye import FireEye

socket = FireEye.FireEye()

cap = cv2.VideoCapture(0) # Camera number goes here

cap.set(3, 640)
cap.set(4, 480)

ret, frame = cap.read()

socket.writeImg(frame)

count = 0
while(True):
	ret, frame = cap.read()
	if count % 2:
		socket.writeImg(frame)
	count += 1