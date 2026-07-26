---
title: Contest notes — reading the problem is a skill
date: 2026-07-16
tags: competitive-programming, codeforces
---

Lost 20 minutes on a problem this week because I assumed the array was 1-indexed. It was not. Here's what I'm changing.

## The checklist

1. Read constraints **before** thinking about the approach
2. Re-read the output format after solving on paper
3. Write the brute force first if n is small enough

## A snippet I keep re-deriving

Binary search on the answer, which I apparently need tattooed somewhere:

```cpp
long lo = 0, hi = 1e18;
while (lo < hi) {
    long mid = lo + (hi - lo) / 2;
    if (ok(mid)) hi = mid;
    else lo = mid + 1;
}
```

The bug is never in the binary search. The bug is in `ok()`.
