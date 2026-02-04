#!/usr/bin/env python3
"""
Process TikTok posts into organized markdown files
"""
import re
import os

def clean_filename(text):
    """Create a safe filename from text"""
    # Remove special characters
    text = re.sub(r'[^\w\s-]', '', text)
    # Replace spaces with underscores
    text = re.sub(r'[\s]+', '_', text)
    # Limit length
    return text[:100]

def extract_key_topics(description):
    """Extract key teaching points from TikTok captions"""
    topics = []
    
    # Extract hashtags
    hashtags = re.findall(r'#(\w+)', description)
    
    # Common teaching indicators
    if any(word in description.lower() for word in ['how to', 'tutorial', 'strategy', 'method', 'secret']):
        topics.append('Tutorial/Strategy')
    if any(word in description.lower() for word in ['viral', 'views', 'algorithm']):
        topics.append('Viral Content')
    if any(word in description.lower() for word in ['product', 'winning']):
        topics.append('Product Research')
    if any(word in description.lower() for word in ['money', 'profit', 'earnings', '$']):
        topics.append('Revenue/Results')
    
    return topics, hashtags

# Read the TikTok posts file
with open('tiktok_posts.txt', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Filter out error/warning lines
posts = []
for line in lines:
    if '|' in line and not line.startswith('WARNING'):
        posts.append(line.strip())

print(f"Processing {len(posts)} TikTok posts...\n")

# Create index file
index_content = "# Logan's TikTok Content Index\n\n"
index_content += f"**Total Posts:** {len(posts)}\n\n"
index_content += "## Posts by Category\n\n"

# Process each post
for i, post in enumerate(posts, 1):
    try:
        parts = post.split('|')
        if len(parts) < 3:
            continue
            
        video_id = parts[0]
        title = parts[1]
        description = parts[2] if len(parts) > 2 else parts[1]
        
        # Extract topics
        topics, hashtags = extract_key_topics(description)
        
        # Create markdown file
        safe_title = clean_filename(title)
        filename = f"{video_id}_{safe_title}.md"
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(f"# {title}\n\n")
            f.write(f"**Video ID:** {video_id}\n")
            f.write(f"**URL:** https://www.tiktok.com/@logancuffari/video/{video_id}\n\n")
            f.write(f"## Caption/Description\n\n")
            f.write(f"{description}\n\n")
            
            if topics:
                f.write(f"## Key Topics\n\n")
                for topic in topics:
                    f.write(f"- {topic}\n")
                f.write("\n")
            
            if hashtags:
                f.write(f"## Hashtags\n\n")
                f.write(f"{', '.join(['#' + tag for tag in hashtags])}\n\n")
        
        # Add to index
        index_content += f"{i}. [{title}]({filename}) - {', '.join(topics) if topics else 'General'}\n"
        
        if i % 10 == 0:
            print(f"Processed {i}/{len(posts)} posts...")
            
    except Exception as e:
        print(f"Error processing post: {e}")
        continue

# Save index
with open('TIKTOK_INDEX.md', 'w', encoding='utf-8') as f:
    f.write(index_content)

print(f"\n✓ Processed {len(posts)} TikTok posts!")
print(f"✓ Created TIKTOK_INDEX.md")
