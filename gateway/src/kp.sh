#!/bin/bash

# Check if at least one port is provided
if [ $# -lt 1 ]; then
  echo "Usage: $0 <port1> <port2> ... <portN>"
  exit 1
fi

# Loop through each port provided
for port in "$@"
do
  # Find the process ID (PID) associated with the given port
  pid=$(lsof -t -i :$port)

  # If a process is found, kill it
  if [ -n "$pid" ]; then
    echo "Killing process on port $port (PID: $pid)"
    kill -9 $pid
  else
    echo "No process found on port $port"
  fi
done
