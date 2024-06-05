import React from 'react';
import './CoursesHome.css';

const items = [
  {
    imageUrl: 'https://via.placeholder.com/81x100',
    title: 'Information',
    description: 'Find useful links to figure out grade requirements, GEMods and more!',
  },
  {
    imageUrl: 'https://via.placeholder.com/138x119',
    title: 'NUSMods',
    description: 'Find out more about each course and plan your timetable on NUSMods.',
  },
  {
    imageUrl: 'https://via.placeholder.com/147x120',
    title: 'Still have Questions?',
    description: 'Ask and answer questions related to courses.',
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

const CoursesHome = () => (
  <div className="courses-container">
    {items.map((item) => (
      <Item key={item.title} imageUrl={item.imageUrl} title={item.title} description={item.description} />
    ))}
  </div>
);

export default CoursesHome;
