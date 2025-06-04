#!/bin/bash
# Auto-increments PATCH version

latest=$(git tag | sort -V | tail -n1)
IFS='.' read -r major minor patch <<< "${latest#v}"
new_tag="v$major.$minor.$((patch + 1))"

git tag -a "$new_tag" -m "Release $new_tag"
git push origin "$new_tag"

echo "📦 Created and pushed tag: $new_tag"
