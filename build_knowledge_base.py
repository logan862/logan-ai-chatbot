#!/usr/bin/env python3
"""
Build comprehensive knowledge base from all sources
"""
import os
import json
import glob
from collections import defaultdict

def extract_key_topics_from_text(text):
    """Extract key topics from content"""
    text_lower = text.lower()
    topics = set()
    
    # TikTok Shop strategies
    if any(word in text_lower for word in ['strategy', 'method', 'approach', 'tactic']):
        topics.add('TikTok Shop Strategies')
    
    # Product research
    if any(word in text_lower for word in ['product', 'winning', 'research', 'find products']):
        topics.add('Product Research')
    
    # Content creation
    if any(word in text_lower for word in ['content', 'video', 'hook', 'viral', 'views', 'algorithm']):
        topics.add('Content Creation')
    
    # Account growth
    if any(word in text_lower for word in ['followers', 'grow', 'account', '5000', 'growth']):
        topics.add('Account Growth')
    
    # Revenue/monetization
    if any(word in text_lower for word in ['money', 'profit', 'earnings', 'revenue', '$', 'commission']):
        topics.add('Revenue & Monetization')
    
    # Common problems/solutions
    if any(word in text_lower for word in ['problem', 'issue', 'fix', 'mistake', 'avoid', "don't"]):
        topics.add('Problems & Solutions')
    
    # Case studies
    if any(word in text_lower for word in ['made $', 'generated', 'case study', 'example', 'student', 'kelly']):
        topics.add('Case Studies')
    
    # Technical setup
    if any(word in text_lower for word in ['setup', 'start', 'tutorial', 'step-by-step', 'beginner']):
        topics.add('Technical Setup')
    
    # Advanced techniques
    if any(word in text_lower for word in ['advanced', 'ai', 'automation', 'scale', 'system']):
        topics.add('Advanced Techniques')
    
    return list(topics)

def process_youtube_content():
    """Process all YouTube transcripts"""
    print("Processing YouTube content...")
    youtube_dir = 'knowledge/youtube'
    content_list = []
    
    for filename in glob.glob(os.path.join(youtube_dir, '*_.md')):
        try:
            with open(filename, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Extract metadata
            lines = content.split('\n')
            title = lines[0].replace('# ', '') if lines else 'Untitled'
            video_id = ''
            url = ''
            
            for line in lines[:10]:
                if 'Video ID:' in line:
                    video_id = line.split('Video ID:')[1].strip().replace('**', '')
                if 'URL:' in line:
                    url = line.split('URL:')[1].strip().replace('**', '')
            
            # Extract topics
            topics = extract_key_topics_from_text(content)
            
            content_list.append({
                'title': title,
                'url': url,
                'video_id': video_id,
                'source': 'YouTube',
                'topics': topics,
                'content': content,
                'filename': filename
            })
            
            print(f"  ✓ {title[:60]}...")
            
        except Exception as e:
            print(f"  Error processing {filename}: {e}")
    
    return content_list

def process_tiktok_content():
    """Process all TikTok posts"""
    print("\nProcessing TikTok content...")
    tiktok_dir = 'knowledge/tiktok'
    content_list = []
    
    for filename in glob.glob(os.path.join(tiktok_dir, '*_.md')):
        try:
            with open(filename, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Extract metadata
            lines = content.split('\n')
            title = lines[0].replace('# ', '') if lines else 'Untitled'
            video_id = ''
            url = ''
            
            for line in lines[:10]:
                if 'Video ID:' in line:
                    video_id = line.split('Video ID:')[1].strip().replace('**', '')
                if 'URL:' in line:
                    url = line.split('URL:')[1].strip().replace('**', '')
            
            # Extract topics
            topics = extract_key_topics_from_text(content)
            
            content_list.append({
                'title': title,
                'url': url,
                'video_id': video_id,
                'source': 'TikTok',
                'topics': topics,
                'content': content[:1000],  # Store first 1000 chars for TikTok
                'filename': filename
            })
            
        except Exception as e:
            print(f"  Error processing {filename}: {e}")
    
    print(f"  ✓ Processed {len(content_list)} TikTok posts")
    return content_list

def build_topic_index(all_content):
    """Build searchable topic index"""
    print("\nBuilding topic index...")
    topic_index = defaultdict(list)
    
    for item in all_content:
        for topic in item['topics']:
            topic_index[topic].append({
                'title': item['title'],
                'url': item['url'],
                'source': item['source']
            })
    
    return dict(topic_index)

def create_master_knowledge_base(all_content):
    """Create master knowledge base document"""
    print("\nCreating master knowledge base...")
    
    kb = "# Logan's TikTok Shop Knowledge Base\n\n"
    kb += "## Overview\n\n"
    kb += f"**Total Sources:** {len(all_content)}\n"
    
    youtube_count = len([c for c in all_content if c['source'] == 'YouTube'])
    tiktok_count = len([c for c in all_content if c['source'] == 'TikTok'])
    
    kb += f"- YouTube Videos: {youtube_count} (with full transcripts)\n"
    kb += f"- TikTok Posts: {tiktok_count}\n\n"
    
    kb += "## Content by Topic\n\n"
    
    # Group by topics
    topic_groups = defaultdict(list)
    for item in all_content:
        for topic in item['topics']:
            topic_groups[topic].append(item)
    
    for topic in sorted(topic_groups.keys()):
        kb += f"### {topic}\n\n"
        items = topic_groups[topic]
        kb += f"**{len(items)} resources**\n\n"
        
        # Show top 10 from this topic
        for item in items[:10]:
            kb += f"- [{item['title']}]({item['url']}) ({item['source']})\n"
        
        if len(items) > 10:
            kb += f"- ... and {len(items) - 10} more\n"
        
        kb += "\n"
    
    kb += "---\n\n"
    kb += "## Full YouTube Transcripts\n\n"
    
    # Add full YouTube content
    youtube_items = [c for c in all_content if c['source'] == 'YouTube']
    for item in youtube_items:
        kb += f"## {item['title']}\n\n"
        kb += f"**URL:** {item['url']}\n"
        kb += f"**Topics:** {', '.join(item['topics'])}\n\n"
        kb += "### Full Transcript\n\n"
        kb += item['content'] + "\n\n"
        kb += "---\n\n"
    
    return kb

# Main execution
print("=" * 60)
print("Building Logan's AI Chatbot Knowledge Base")
print("=" * 60 + "\n")

# Process all content sources
youtube_content = process_youtube_content()
tiktok_content = process_tiktok_content()

all_content = youtube_content + tiktok_content

# Build topic index
topic_index = build_topic_index(all_content)

# Save topic index
with open('topic-index.json', 'w', encoding='utf-8') as f:
    json.dump(topic_index, f, indent=2, ensure_ascii=False)
print(f"✓ Saved topic-index.json ({len(topic_index)} topics)")

# Create master knowledge base
master_kb = create_master_knowledge_base(all_content)

with open('knowledge-base.md', 'w', encoding='utf-8') as f:
    f.write(master_kb)
print(f"✓ Saved knowledge-base.md")

# Create content metadata JSON for RAG system
metadata = []
for item in all_content:
    metadata.append({
        'title': item['title'],
        'url': item['url'],
        'source': item['source'],
        'topics': item['topics'],
        'filename': item['filename']
    })

with open('content-metadata.json', 'w', encoding='utf-8') as f:
    json.dump(metadata, f, indent=2, ensure_ascii=False)
print(f"✓ Saved content-metadata.json ({len(metadata)} items)")

print("\n" + "=" * 60)
print("✅ Knowledge Base Build Complete!")
print("=" * 60)
print(f"\nSummary:")
print(f"  - YouTube videos: {len(youtube_content)}")
print(f"  - TikTok posts: {len(tiktok_content)}")
print(f"  - Total content items: {len(all_content)}")
print(f"  - Unique topics: {len(topic_index)}")
print(f"\nFiles created:")
print(f"  - knowledge-base.md (master document)")
print(f"  - topic-index.json (searchable index)")
print(f"  - content-metadata.json (for RAG system)")
