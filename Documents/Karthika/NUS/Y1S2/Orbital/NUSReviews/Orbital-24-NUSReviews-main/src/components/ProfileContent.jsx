import React from 'react';
import './ProfileContent.css'; 

const UserProfile = () => {
  return (
    <div className="user-profile">
      <div className="profile-picture">
        <div className="profile-picture-image">
          <img src="https://via.placeholder.com/128x128" alt="Profile" />
        </div>
        <div className="profile-picture-edit">
          Edit profile image
        </div>
      </div>
      <div className="user-info">
        {[
          { label: "Name", value: "xxxx" },
          { label: "Username", value: "@username" },
          { label: "Email", value: "name@u.nus.edu" },
          { label: "NUS Student/Alumni/ Staff", value: "Student" },
          { label: "Level of Study", value: "Bachelors" },
          { label: "Course of Study", value: "CS" },
          { label: "Year of Study", value: "Year 1" },
          { label: "Additional Information", value: "xxxxxx..." },
        ].map((item, index) => (
          <div key={index} className="user-info-item">
            <div className="user-info-item-label">{item.label}</div>
            <div className="user-info-item-value">{item.value}</div>
            <div className="user-info-item-icon"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfile;
