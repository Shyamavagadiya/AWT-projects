import React from 'react';

function VideoItem({ video, onVideoSelect }) {
  return (
    <div 
      className="video-item" 
      onClick={() => onVideoSelect(video)}
    >
      <img 
        src={video.thumbnail} 
        alt={video.title} 
        className="thumbnail" 
      />
      <div className="video-item-info">
        <h4>{video.title}</h4>
        <p>{video.channel}</p>
        <p>{video.views}</p>
      </div>
    </div>
  );
}

export default VideoItem;