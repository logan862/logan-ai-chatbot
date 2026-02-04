#!/bin/bash
# Download all YouTube transcripts for Logan's channel

echo "Starting transcript download..."

# Read video IDs from the list
while IFS='|' read -r video_id title duration; do
    echo "Processing: $title"
    
    # Create safe filename
    safe_title=$(echo "$title" | tr '/' '-' | tr ':' '-' | tr '?' '' | tr '"' '' | tr '<' '' | tr '>' '' | tr '|' '-')
    filename="${video_id}_${safe_title}.md"
    
    # Download video info and transcript
    yt-dlp \
        --skip-download \
        --write-auto-sub \
        --write-sub \
        --sub-lang en \
        --convert-subs srt \
        --output "temp_${video_id}" \
        "https://www.youtube.com/watch?v=${video_id}" 2>&1
    
    # Create markdown file with metadata and transcript
    echo "# $title" > "$filename"
    echo "" >> "$filename"
    echo "**Video ID:** $video_id" >> "$filename"
    echo "**URL:** https://www.youtube.com/watch?v=${video_id}" >> "$filename"
    echo "**Duration:** ${duration}s" >> "$filename"
    echo "" >> "$filename"
    echo "## Transcript" >> "$filename"
    echo "" >> "$filename"
    
    # Find and convert subtitle file to markdown
    if [ -f "temp_${video_id}.en.srt" ]; then
        # Convert SRT to plain text (remove timestamps and numbers)
        sed -e '/^[0-9]*$/d' -e '/^[0-9][0-9]:[0-9][0-9]:[0-9][0-9]/d' -e '/^$/d' "temp_${video_id}.en.srt" >> "$filename"
        rm "temp_${video_id}.en.srt"
    else
        echo "No transcript available for this video." >> "$filename"
    fi
    
    # Clean up temp files
    rm -f temp_${video_id}.*
    
    echo "✓ Saved: $filename"
    echo ""
    
done < video_list.txt

echo "All transcripts downloaded!"
