#!/usr/bin/env python3
"""WCAG contrast checker: reads JSON pairs [{name,fgHex,bgHex,role}] from argv[1]."""
import json, sys

def srgb_to_lin(c):
    c /= 255.0
    return c / 12.92 if c <= 0.04045 * 255 / 255 else ((c + 0.055) / 1.055) ** 2.4

def luminance(hexstr):
    h = hexstr.lstrip('#')
    if len(h) == 3:
        h = ''.join(ch * 2 for ch in h)
    r, g, b = (int(h[i:i+2], 16) for i in (0, 2, 4))
    return 0.2126 * srgb_to_lin(r) + 0.7152 * srgb_to_lin(g) + 0.0722 * srgb_to_lin(b)

def ratio(fg, bg):
    l1, l2 = sorted((luminance(fg), luminance(bg)), reverse=True)
    return (l1 + 0.05) / (l2 + 0.05)

pairs = json.load(open(sys.argv[1]))
fails = 0
for p in pairs:
    r = ratio(p['fgHex'], p['bgHex'])
    need = 4.5 if p['role'] == 'body' else 3.0
    ok = r >= need
    fails += (not ok)
    print(f"{'PASS' if ok else 'FAIL'}  {r:5.2f}:1 (need {need}) {p['name']}  {p['fgHex']} on {p['bgHex']} [{p['role']}]")
sys.exit(1 if fails else 0)
