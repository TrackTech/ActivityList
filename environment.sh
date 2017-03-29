#!/bin/bash
echo "NodeJS starting in new terminal"
xterm -hold -e node ../NodeJsServer/main.js &

echo "Mongod Starting in new terminal"
xterm -hold -e mongod &

echo "Nginx service starting"
service nginx start


