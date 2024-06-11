import { useState, useEffect } from 'react';
import './ProfileContent.css';
import Sidebar from './Sidebar';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, storage } from '../firebase-config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const ProfileContent = () => {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState({
    name: '',
    username: '',
    email: '',
    role: '',
    levelOfStudy: '',
    courseOfStudy: '',
    yearOfStudy: '',
    additionalInfo: '',
    profileImage: '', // Added profileImage field
    flaggedContributions: 0,
    contributionsThisSemester: 0,
    eligibilityForBonus: 'No'
  });
  const auth = getAuth();

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (user) {
        setUser(user);
        setProfileData((prevData) => ({
          ...prevData,
          email: user.email // Prefill email field
        }));
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfileData((prevData) => ({
            ...prevData,
            ...docSnap.data()
          }));
        }
      }
    };
    fetchData();
  }, [auth]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (user) {
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, profileData, { merge: true });
      alert('Profile updated successfully');
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const storageRef = ref(storage, `profileImages/${user.uid}`);
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);
      setProfileData((prevData) => ({
        ...prevData,
        profileImage: imageUrl,
      }));
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-header">
          <img src={profileData.profileImage || "https://via.placeholder.com/128x128"} alt="Profile" className="profile-image" />
          <div className="edit-profile">
            <label className="edit-profile-text">
              Edit profile image
              <input type="file" style={{ display: 'none' }} onChange={handleImageChange} />
            </label>
            <div className="profile-stats">
              <div>Flagged Contributions: {profileData.flaggedContributions}</div>
              <div>Contributions This Semester: {profileData.contributionsThisSemester}</div>
              <div>Eligibility for Bonus Points: {profileData.eligibilityForBonus}</div>
            </div>
          </div>
        </div>
        <div className="profile-info">
          {[
            { label: 'Name', name: 'name', value: profileData.name, type: 'text' },
            { label: 'Username', name: 'username', value: profileData.username, type: 'text' },
            { label: 'Email', name: 'email', value: profileData.email, type: 'text', disabled: true }, // Disabled to prevent editing
          ].map((item, index) => (
            <div key={index} className="profile-info-row">
              <div className="profile-info-label">{item.label}</div>
              <input
                className="profile-info-value"
                type={item.type}
                name={item.name}
                value={item.value}
                onChange={handleInputChange}
                disabled={item.disabled || false} // Condition to disable email field
              />
            </div>
          ))}
          <div className="profile-info-row">
            <div className="profile-info-label">NUS Student/Alumni/Staff</div>
            <select
              className="profile-info-value"
              name="role"
              value={profileData.role}
              onChange={handleInputChange}
            >
              <option value="">Select Role</option>
              <option value="Student">Student</option>
              <option value="Alumni">Alumni</option>
              <option value="Staff">Staff</option>
            </select>
          </div>
          <div className="profile-info-row">
            <div className="profile-info-label">Level of Study</div>
            <select
              className="profile-info-value"
              name="levelOfStudy"
              value={profileData.levelOfStudy}
              onChange={handleInputChange}
            >
              <option value="">Select Level of Study</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Postgraduate">Postgraduate</option>
            </select>
          </div>
          <div className="profile-info-row">
            <div className="profile-info-label">Course of Study</div>
            <input
              className="profile-info-value"
              type="text"
              name="courseOfStudy"
              value={profileData.courseOfStudy}
              onChange={handleInputChange}
            />
          </div>
          <div className="profile-info-row">
            <div className="profile-info-label">Year of Study</div>
            <select
              className="profile-info-value"
              name="yearOfStudy"
              value={profileData.yearOfStudy}
              onChange={handleInputChange}
            >
              <option value="">Select Year of Study</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
          <div className="profile-info-row">
            <div className="profile-info-label">Additional Information</div>
            <input
              className="profile-info-value"
              type="text"
              name="additionalInfo"
              value={profileData.additionalInfo}
              onChange={handleInputChange}
            />
          </div>
          <button className="save-button" onClick={handleSave}>Save</button>
        </div>
      </div>
      <Sidebar />
    </div>
  );
};

export default ProfileContent;