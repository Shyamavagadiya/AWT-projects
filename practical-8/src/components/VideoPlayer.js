import React from 'react';

function VideoPlayer({ video }) {
  return (
    <div className="video-player">
      <div className="video-container">
        <video
          src={video.url}
          controls
          width="100%"
          poster="https://via.placeholder.com/640x360"
        ></video>
      </div>
      <div className="video-info">
        <h2>{video.title}</h2>
        <p>{video.channel}</p>
      </div>
    </div>
  );
}

export default VideoPlayer;