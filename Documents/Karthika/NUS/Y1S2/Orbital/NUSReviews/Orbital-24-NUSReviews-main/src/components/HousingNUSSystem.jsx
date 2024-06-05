import React from 'react';
import './HousingNUSSystem.css'; // Import the CSS file

const HousingNUSSystem = () => {
  return (
    <div className="housing-nus-system">
      <div className="image-container">
        <div className="image-item">
          <img src="https://via.placeholder.com/519x308" alt="Halls of Residence" />
          <div className="image-caption">
            <div className="image-title">Halls of Residence</div>
            <div>Hostel Rates</div>
            <div>Meal Plan Rates</div>
          </div>
        </div>
        <div className="image-item">
          <img src="https://via.placeholder.com/549x308" alt="Houses" />
          <div className="image-caption">
            <div className="image-title">Houses</div>
            <div>Hostel Rates</div>
            <div>No meal plan available</div>
          </div>
        </div>
        <div className="image-item">
          <img src="https://via.placeholder.com/519x308" alt="Residential Colleges" />
          <div className="image-caption">
            <div className="image-title">Residential Colleges</div>
            <div>Hostel Rates</div>
            <div>Meal Plan Rates</div>
          </div>
        </div>
        <div className="image-item">
          <img src="https://via.placeholder.com/549x308" alt="Student Residences" />
          <div className="image-caption">
            <div className="image-title">Student Residences</div>
            <div>Hostel Rates</div>
            <div>No meal plan available</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HousingNUSSystem;
