#!/bin/bash
# Auto-increments MINOR version and resets PATCH to 0

latest=$(git tag | sort -V | tail -n1)
IFS='.' read -r major minor patch <<< "${latest#v}"
new_tag="v$major.$((minor + 1)).0"

git tag -a "$new_tag" -m "Release $new_tag"
git push origin "$new_tag"

echo "📦 Created and pushed tag: $new_tag"
