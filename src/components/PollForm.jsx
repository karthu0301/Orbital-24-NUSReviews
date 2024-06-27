import { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import './PollForm.css'; // Assuming CSS is in this file

const PollForm = ({ fixedCategory }) => {
    const [title, setTitle] = useState('');
    const [options, setOptions] = useState(['', '']);
    const [category, setCategory] = useState('');
    const [multiple, setMultiple] = useState(false);
    const [errors, setErrors] = useState({});
    const auth = getAuth();

    useEffect(() => {
        if (fixedCategory) {
            setCategory(fixedCategory);
        }
    }, [fixedCategory]);

    const handleOptionChange = (index, event) => {
        const newOptions = [...options];
        newOptions[index] = event.target.value;
        setOptions(newOptions);
    };

    const handleAddOption = () => {
        setOptions([...options, '']);
    };

    const handleRemoveLastOption = () => {
        setOptions(options.slice(0, -1));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!title.trim()) newErrors.title = 'Title is required!';
        if (!category) newErrors.category = 'Category is required!';
        const filledOptions = options.filter(option => option.trim() !== '');
        if (filledOptions.length < 2) newErrors.options = 'At least two options are required!';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!validateForm()) return;

        const user = auth.currentUser;
        const creatorId = user ? user.uid : 'not_registered_user';

        const pollData = {
            title,
            options: options.filter(option => option.trim() !== '').map(option => ({ option, votes: 0 })),
            category,
            multiple,
            creatorId,
            createdAt: new Date()
        };

        try {
            await addDoc(collection(db, "polls"), pollData);
            alert('Poll created successfully!');
            setTitle('');
            setOptions(['', '']);
            setMultiple(false);
            setErrors({});
        } catch (error) {
            console.error("Error adding document: ", error);
            alert('Error creating poll');
        }
    };

    return (
        <div className="poll-form-container">
            <div className="poll-form-header">
                Create Your Poll
            </div>
            <form onSubmit={handleSubmit}>
                <input className="poll-input" type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Poll Title" required />
                {errors.title && <div className="error">{errors.title}</div>}
                {options.map((option, index) => (
                    <input key={index} className="poll-input" type="text" value={option} onChange={e => handleOptionChange(index, e)} placeholder={`Option ${index + 1}`} required />
                ))}
                <button type="button" className="poll-button add-option-button" onClick={handleAddOption}>
                    <FontAwesomeIcon icon={faPlus} />
                </button>
                {options.length > 2 && (
                    <button type="button" className="poll-button remove-option-button" onClick={handleRemoveLastOption}>
                        <FontAwesomeIcon icon={faMinus} />
                    </button>
                )}
                {!fixedCategory && (
                    <div>
                    <label>Category:</label>
                    <select value={category} onChange={e => setCategory(e.target.value)} className="poll-input poll-select">
                        <option value="">Select a Category</option>
                        <option value="courses">Courses</option>
                        <option value="housing">Housing</option>
                        <option value="food">Food</option>
                        <option value="others">Others</option>
                    </select>
                </div>
                )}
                {errors.category && <div className="error">{errors.category}</div>}
                <label className="poll-checkbox">
                    <input type="checkbox" checked={multiple} onChange={e => setMultiple(e.target.checked)} />
                    <span>Allow multiple responses?</span>
                </label>
                <button type="submit" className="poll-button">Create Poll</button>
            </form>
        </div>
    );
};

export default PollForm;