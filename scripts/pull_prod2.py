#!/usr/bin/env python3

import os
import subprocess
import sys

# Set the repository URL and branch name
REPO_URL = "https://github.com/bendatsko/frg-web.git"
BRANCH = "prod2"

def run_command(command):
    """Run a shell command and return its output."""
    try:
        result = subprocess.run(command, check=True, text=True, capture_output=True)
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"Error executing command: {' '.join(command)}")
        print(f"Error message: {e.stderr.strip()}")
        sys.exit(1)

def is_git_repo():
    """Check if the current directory is inside a git repository."""
    try:
        run_command(["git", "rev-parse", "--is-inside-work-tree"])
        return True
    except subprocess.CalledProcessError:
        return False

def main():
    # Check if we're in a git repository
    if not is_git_repo():
        print("Error: This script must be run from within the git repository.")
        sys.exit(1)

    # Get the repository root directory
    repo_root = run_command(["git", "rev-parse", "--show-toplevel"])

    # Change to the repository root
    os.chdir(repo_root)

    # Fetch the latest changes from the remote repository
    print(f"Fetching latest changes from {REPO_URL}...")
    run_command(["git", "fetch", "origin", BRANCH])

    # Check the current branch
    current_branch = run_command(["git", "rev-parse", "--abbrev-ref", "HEAD"])
    if current_branch != BRANCH:
        print(f"Switching to branch {BRANCH}...")
        run_command(["git", "checkout", BRANCH])

    # Pull the latest changes
    print(f"Pulling latest changes from {BRANCH} branch...")
    run_command(["git", "pull", "origin", BRANCH])

    print(f"Successfully pulled latest changes from {BRANCH} branch.")

if __name__ == "__main__":
    main()