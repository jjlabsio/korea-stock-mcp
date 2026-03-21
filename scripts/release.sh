#!/bin/bash
set -e

# 0. Check npm login status
if ! npm whoami &> /dev/null; then
  echo "❌ npm에 로그인되어 있지 않습니다. 먼저 'npm login'을 실행해주세요."
  exit 1
fi

# 1. Generate changelog and bump version
npx changelogen --release

# 2. Publish to npm
npm publish

# 3. Push commits and tags
git push
git push --tags

# 4. Create GitHub release from latest tag
npx changelogen gh release
