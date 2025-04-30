import React, { useState } from 'react';
import './App.css';
import VideoPlayer from './components/VideoPlayer';
import VideoList from './components/VideoList';

function App() {
  const [selectedVideo, setSelectedVideo] = useState({
    id: 1,
    title: 'Sample Video 1',
    url: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4',
    channel: 'Test Channel'
  });

  const videos = [
    {
      id: 1,
      title: 'Sample Video 1',
      url: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4',
      thumbnail: 'https://via.placeholder.com/320x180',
      channel: 'Test Channel',
      views: '1.2K views'
    },
    {
      id: 2,
      title: 'Nature Video',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4',
      thumbnail: 'https://via.placeholder.com/320x180',
      channel: 'Nature Channel',
      views: '4.5K views'
    },
    {
      id: 3,
      title: 'Beach Waves',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4',
      thumbnail: 'https://via.placeholder.com/320x180',
      channel: 'Beach Vibes',
      views: '2.7K views'
    }
  ];

  return (
    <div className="app">
      <header className="header">
        <h1 className="logo">MyTube</h1>
      </header>
      <main className="main-content">
        <VideoPlayer video={selectedVideo} />
        <VideoList videos={videos} onVideoSelect={setSelectedVideo} />
      </main>
    </div>
  );
}

export default App;