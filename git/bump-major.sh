#!/bin/bash
# Auto-increments MAJOR version and resets MINOR and PATCH to 0

latest=$(git tag | sort -V | tail -n1)
IFS='.' read -r major minor patch <<< "${latest#v}"
new_tag="v$((major + 1)).0.0"

git tag -a "$new_tag" -m "Release $new_tag"
git push origin "$new_tag"

echo "📦 Created and pushed tag: $new_tag"
