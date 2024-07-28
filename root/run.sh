# This script 1.) installs necessary dependencies 2.) runs the frontend, backend, and test runner in the correct order 3.) runs system integration tests to verify functionality before platform useage



# frontend: run npm install
# npm run dev

#backend-test runner:
# make sure platformio is installed on your system
# you may need to modify system rules so rhel doesn't mistake the teensy for a modem: 
# wget https://www.pjrc.com/teensy/00-teensy.rules
# sudo cp 00-teensy.rules /etc/udev/rules.d/
# sudo udevadm control --reload-rules

# 
# backend-rest api:
# npm install
# make sure you have the right port address for the right device numbers in your server.
# npm start

# keep in mind you'll need to restart the backend every time you reflash to the teensy test driver because the serial connection will be interrupted.