#!/bin/bash

# This script is used to run tests for the application.

# Exit immediately if a command exits with a non-zero status.
set -e

# Define the test command
TEST_COMMAND="npm test"

# Run the tests
echo "Running tests..."
$TEST_COMMAND

# Check if tests passed
if [ $? -eq 0 ]; then
  echo "All tests passed successfully."
else
  echo "Some tests failed. Please check the output above."
  exit 1
fi