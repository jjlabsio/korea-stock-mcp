#!/bin/bash
set -e

# 1. Generate changelog and bump version
npx changelogen --release

# 2. Publish to npm
npm publish

# 3. Push commits and tags
git push
git push --tags

# 4. Create GitHub release from latest tag
TAG=$(git describe --tags --abbrev=0)
npx changelogen gh release
