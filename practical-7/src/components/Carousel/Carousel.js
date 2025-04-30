import React, { useState, useEffect } from 'react';
import './Carousel.css';

// Simple image carousel component
const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance carousel every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [images.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % images.length
    );
  };

  return (
    <div className="carousel-container">
      <div className="carousel-image-container">
        <img 
          src={images[currentIndex]} 
          alt={`Slide ${currentIndex}`} 
          className="carousel-image"
        />
      </div>
      
      <div className="carousel-controls">
        <button onClick={goToPrevious} className="carousel-button">
          &lt; Prev
        </button>
        
        <div className="carousel-indicators">
          {images.map((_, index) => (
            <span 
              key={index}
              className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
        
        <button onClick={goToNext} className="carousel-button">
          Next &gt;
        </button>
      </div>
    </div>
  );
};

export default Carousel;