#!/bin/bash

# Kill any process using port 5006
echo "Checking for processes on port 5006..."
lsof -ti:5006 | xargs kill -9 2>/dev/null && echo "Killed process on port 5006" || echo "Port 5006 is free"

# Kill any dotnet backend processes
ps aux | grep -i "dotnet.*backend" | grep -v grep | awk '{print $2}' | xargs kill -9 2>/dev/null && echo "Killed dotnet backend processes" || echo "No dotnet processes found"

# Wait a moment
sleep 1

# Run the application
echo "Starting backend server..."
cd "$(dirname "$0")"
dotnet run

