#!/bin/bash

# Clear the terminal
clear

# Print starting message
echo "🏦 Starting Royal Business Bank Application 🏦"
echo "==============================================="
echo ""
echo "⚙️  Environment configuration:"
echo "   - PORT: 3006"
echo "   - NODE_ENV: development"
echo ""
echo "🔧 Running pre-checks..."

# Check node version
node_version=$(node -v)
echo "   - Node.js version: $node_version"

# Check if port 3006 is available
if lsof -Pi :3006 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  WARNING: Port 3006 is already in use!"
    echo "   - Please close the application using this port or change the PORT in .env file"
    exit 1
fi

echo "   - Port 3006 is available ✅"
echo ""
echo "🚀 Starting application..."
echo "   - Application will be available at: http://localhost:3006"
echo "   - Press Ctrl+C to stop the server"
echo ""

# Set environment variables explicitly
export PORT=3006
export BROWSER=none  # Prevent auto-opening browser

# Start application in development mode
echo "💻 Starting development server..."
npm start --prefix $(pwd) || {
    echo "❌ Failed to start the server. Please check the error message above."
    exit 1
}