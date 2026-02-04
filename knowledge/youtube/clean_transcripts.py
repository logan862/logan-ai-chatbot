#!/usr/bin/env python3
"""
Clean YouTube transcripts - remove duplicate lines from SRT conversion
"""
import os
import re
import glob

def clean_transcript(content):
    """Remove duplicate consecutive lines from transcript"""
    lines = content.split('\n')
    cleaned_lines = []
    prev_line = None
    
    for line in lines:
        line = line.strip()
        if line and line != prev_line:
            cleaned_lines.append(line)
            prev_line = line
        elif line == '':
            cleaned_lines.append('')
            prev_line = None
    
    return '\n'.join(cleaned_lines)

# Find all markdown files
md_files = glob.glob('*.md')
md_files = [f for f in md_files if f != 'YOUTUBE_INDEX.md' and '_' in f]

print(f"Cleaning {len(md_files)} transcript files...\n")

for filename in md_files:
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Clean the transcript
        cleaned = clean_transcript(content)
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(cleaned)
        
        print(f"✓ Cleaned: {filename}")
    except Exception as e:
        print(f"Error cleaning {filename}: {e}")

print(f"\n✓ All transcripts cleaned!")
