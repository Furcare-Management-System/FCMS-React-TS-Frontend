#!/bin/bash
echo > .nojekyll

# Change to the build directory
cd dist

# Initialize a new Git repository in the build directory (if not already initialized)
git init
git checkout -B main
# Commit all the built files
git add -A
git commit -m "Deploy to GitHub Pages"

# Example: Deploy to GitHub Pages
# Change "your-username" and "your-repo" to your GitHub username and repository name
git push -f https://github.com/xyang221/furcare-frontend.git master:gh-pages

# Optionally: Deploy to other hosting services or copy the build files to a server

cd -