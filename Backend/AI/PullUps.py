import cv2
import mediapipe as mp
import numpy as np
import PoseModule as pm

cap = cv2.VideoCapture(0)
detector = pm.poseDetector()
count = 0
direction = 0  # 0 for down, 1 for up

while cap.isOpened():
    ret, img = cap.read()
    img = detector.findPose(img, False)
    lmList = detector.findPosition(img, False)

    if len(lmList) != 0:
        # Assuming indices 11 and 13 correspond to shoulder and elbow respectively
        # You might need to adjust these indices based on your pose model
        elbow_angle = detector.findAngle(img, 11, 13, 15)

        # Pull-up logic based on elbow angle
        if elbow_angle < 45:  # Threshold for chin over the bar
            if direction == 0:  # From down to up
                direction = 1
        elif elbow_angle > 160:  # Threshold for arms fully extended
            if direction == 1:  # From up to down
                count += 1
                direction = 0

        # Display the count
        cv2.putText(img, f'Pull-ups: {int(count)}', (10, 50), cv2.FONT_HERSHEY_PLAIN, 2, (255, 0, 0), 2)

    cv2.imshow('Pull-up Counter', img)

    if count == 10:
        print('Task Complete')

    if cv2.waitKey(10) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
