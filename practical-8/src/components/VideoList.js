import React from 'react';
import VideoItem from './VideoItem';

function VideoList({ videos, onVideoSelect }) {
  return (
    <div className="video-list">
      <h3>Recommended Videos</h3>
      {videos.map(video => (
        <VideoItem 
          key={video.id} 
          video={video} 
          onVideoSelect={onVideoSelect} 
        />
      ))}
    </div>
  );
}

export default VideoList;