#!/bin/bash

# Clear terminal
clear

echo "🏦 Royal Business Bank Application Server 🏦"
echo "==========================================="
echo ""
echo "Starting the simplified HTML version on port 3006..."

# Kill any existing process on port 3006
if lsof -ti:3006 > /dev/null ; then
    echo "Port 3006 is in use. Attempting to free it..."
    lsof -ti:3006 | xargs kill -9
    echo "Port freed."
fi

# Change to the directory with the HTML file
cd "$(dirname "$0")"

# Attempt to start the server using python's built-in HTTP server
echo "Starting server..."
echo "The application will be available at: http://localhost:3006"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Try to use Python3 http.server module
python3 -m http.server 3006 &
SERVER_PID=$!

# Open the browser to the simplified app
echo "Opening browser to http://localhost:3006/simplified-app.html"
sleep 2
open "http://localhost:3006/simplified-app.html"

# Wait for user to press Ctrl+C
echo "Server running. Press Ctrl+C to stop."
wait $SERVER_PID