import React from 'react';
import './HousingHome.css';

const items = [
  {
    imageUrl: 'https://via.placeholder.com/81x100',
    title: 'NUS Housing System',
    description: 'NUS Housing consists of halls, houses, residences and residential colleges. What’s the difference - you ask?',
  },
  {
    imageUrl: 'https://via.placeholder.com/138x119',
    title: 'Links to Information',
    description: (
      <span>
        Find out more about each residence type through these{' '}
        <span style={{ color: '#003882', textDecoration: 'underline' }}>links.</span>
      </span>
    ),
  },
  {
    imageUrl: 'https://via.placeholder.com/147x120',
    title: 'Still have Questions?',
    description: 'Ask and answer questions related to housing.',
  },
];

const Item = ({ imageUrl, title, description }) => (
  <div className="item">
    <img className="item-image" src={imageUrl} alt={title} />
    <div className="item-content">
      <h3 className="item-title">{title}</h3>
      <p className="item-description">{description}</p>
    </div>
  </div>
);

const HousingHome = () => (
  <div className="housing-container">
    {items.map((item) => (
      <Item key={item.title} imageUrl={item.imageUrl} title={item.title} description={item.description} />
    ))}
  </div>
);

export default HousingHome;
