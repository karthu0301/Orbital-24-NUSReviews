import { useState, useEffect } from 'react';
import './ProfileContent.css';
import { getAuth, updateProfile, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db, storage } from '../../firebase-config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const ProfileContent = () => {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState({
    name: '',
    displayName: '',
    email: '',
    role: '',
    courseOfStudy: '',
    yearOfStudy: '',
    additionalInfo: '',
    profileImage: '',
    flaggedContributions: 0,
    contributionsThisSemester: 0,
    eligibilityForBonus: 'No',
    lastViewedThreads: {},
    hasUnreadNotifications: false    
  });
  const [errors, setErrors] = useState({});
  const auth = getAuth();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
        setUser(currentUser);
        if (currentUser) {
            const docRef = doc(db, 'users', currentUser.uid);
            const unsubscribe = onSnapshot(docRef, async (docSnap) => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setProfileData(prevData => ({
                        ...prevData,
                        ...userData,
                        displayName: currentUser.displayName, // Prefill displayName
                        email: currentUser.email // Prefill email field
                    }));

                    // Check and update eligibility for bonus points
                    const eligibilityForBonus = await checkBiddingPoints(userData);
                    if (userData.eligibilityForBonus !== eligibilityForBonus) {
                        // Update only if there is a change to reduce unnecessary writes
                        await updateDoc(docRef, { eligibilityForBonus: eligibilityForBonus });
                    }
                } else {
                    console.error("User document does not exist");
                }
            });

            return () => unsubscribe(); // Cleanup subscription on component unmount
        }
    });
    return unsubscribeAuth; // Cleanup auth state listener on component unmount
  }, [auth]);


  const checkBiddingPoints = async (userData) => {
    let earned = 'No';
    const semContributions = userData.contributionsThisSemester;
    const semFlags = userData.flaggedContributions;
  
    if (semContributions >= 7 && semFlags < 5) {
      earned = 'Yes';
    }
  
    return earned;
  };  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = async () => {
    const newErrors = {};
    let isValid = true;
  
    if (!profileData.displayName.trim()) {
      newErrors.displayName = 'Username is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };
  

  const handleSave = async () => {
    const isFormValid = await validateForm();
    if (!isFormValid) {
      alert('Please correct the errors before saving.');
      return; // Stop the execution if the form is not valid
    }

    if (user) {
      // Update display name in Firebase Authentication
      if (profileData.displayName) {
        await updateProfile(user, {
          displayName: profileData.displayName
        });
      }
      
      // Update profile data in Firestore
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
            { label: 'Display Name', name: 'displayName', value: profileData.displayName, type: 'text' },
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
              {errors[item.name] && <div className="error">{errors[item.name]}</div>}
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
              <option value="Student">Student (Undergraduate)</option>
              <option value="Alumni">Alumni</option>
              <option value="Staff">Staff</option>
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
        <div> 
          <p>Note: Completing your profile is optional, but it helps other users learn more about your credibility and background.</p>
        </div>
        <span>* A Display Name is required, it will be shown when you make contributions that are not anonymous.</span>
      </div>
    </div>
  );
};

export default ProfileContent;
