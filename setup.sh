#!/bin/bash

# Function to prompt the user before running a command
run_command() {
  local command="$1"

  echo "Will run: $command"
  echo "Press Enter to continue or Ctrl+C to abort."
  read -r

  eval "$command" || {
    echo "Failed to execute: $command"
    exit 1
  }

  # Clear the screen after each step
  clear
}

# Variables
NEXT_DIR="todo_next"
AXUM_DIR="todo_axum"

# Check if Next.js directory exists
if [ -d "$NEXT_DIR" ]; then
  echo "Setting up Next.js project..."
  cd "$NEXT_DIR" || {
    echo "Failed to navigate to $NEXT_DIR."
    exit 1
  }

  # Run pnpm install
  if command -v pnpm &>/dev/null; then
    run_command "pnpm install"
    run_command "pnpm build"
  else
    echo "pnpm is not installed. Please install pnpm and try again."
    exit 1
  fi

  cd ..
else
  echo "Directory $NEXT_DIR does not exist. Skipping Next.js setup."
fi

# Check if Axum directory exists
if [ -d "$AXUM_DIR" ]; then
  echo "Setting up Axum project..."
  cd "$AXUM_DIR" || {
    echo "Failed to navigate to $AXUM_DIR."
    exit 1
  }

  # Run cargo commands
  if command -v cargo &>/dev/null; then
    run_command "cargo run --release"
  else
    echo "Cargo is not installed. Please install Rust and try again."
    exit 1
  fi

  cd ..
else
  echo "Directory $AXUM_DIR does not exist. Skipping Axum setup."
fi

echo "Setup complete!"
