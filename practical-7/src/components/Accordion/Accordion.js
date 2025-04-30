// src/components/Accordion/Accordion.js
import React, { useState } from 'react';
import './Accordion.css';

// Individual accordion item
const AccordionItem = ({ title, content, isOpen, toggleAccordion }) => {
  return (
    <div className="accordion-item">
      <div 
        className="accordion-header" 
        onClick={toggleAccordion}
      >
        <h3>{title}</h3>
        <span className={`accordion-icon ${isOpen ? 'open' : ''}`}>
          {isOpen ? '−' : '+'}
        </span>
      </div>
      
      {isOpen && (
        <div className="accordion-content">
          <p>{content}</p>
        </div>
      )}
    </div>
  );
};

// Main accordion component
const Accordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(0);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="accordion-container">
      <h2>Frequently Asked Questions</h2>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          content={item.content}
          isOpen={openIndex === index}
          toggleAccordion={() => handleToggle(index)}
        />
      ))}
    </div>
  );
};

export default Accordion;