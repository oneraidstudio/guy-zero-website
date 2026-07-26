---
title: Making blocky assets that don't look lazy
date: 2026-07-22
tags: one-raid-studio, game-assets
---

Low-poly and pixel-art styles get called "easy mode" a lot. They're not — when every block is visible, every block is a decision.

## Three rules I've settled on

- **Silhouette first.** If it doesn't read as a shape in pure black, more detail won't save it.
- **Steal light, not detail.** Two or three shades per material, hue-shifted, beats ten realistic ones.
- **Commit to the grid.** Half-pixel cheats look broken the moment things move.

## Current pipeline

Block-out in the editor, palette pass, then a sticker-shadow render for thumbnails — the same treatment as the avatar on this site.

More on the actual tooling once ORS Hub is presentable.
