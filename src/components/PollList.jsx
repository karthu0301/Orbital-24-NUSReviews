import { useEffect, useState } from 'react';
import { collection, updateDoc, doc, getDoc, arrayUnion, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase-config';
import { getAuth } from 'firebase/auth';
import './PollList.css';

const PollList = ({ filterCategory }) => {
    const [polls, setPolls] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "polls"), (snapshot) => {
            const pollsData = snapshot.docs.map(doc => {
                const options = doc.data().options;
                const totalVotes = options.reduce((total, option) => total + option.votes, 0);
                return {
                    id: doc.id,
                    ...doc.data(),
                    options,
                    totalVotes
                };
            });
            setPolls(pollsData);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const handleVote = async (pollId, optionIndex) => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            alert('You must be logged in to vote.');
            return;
        }

        try {
            const pollRef = doc(db, "polls", pollId);
            const pollDoc = await getDoc(pollRef);
            if (!pollDoc.exists()) {
                console.error('No such document!');
                alert('Poll does not exist');
                return;
            }

            const pollData = pollDoc.data();

            if (!pollData.voters) {
                pollData.voters = [];
            }

            if (!pollData.multiple && pollData.voters.includes(user.uid)) {
                alert('You have already voted for this poll.');
                return;
            }

            pollData.options[optionIndex].votes += 1;

            await updateDoc(pollRef, {
                options: pollData.options,
                voters: arrayUnion(user.uid)
            });

            setPolls(currentPolls => currentPolls.map(p => p.id === pollId ? { ...p, options: pollData.options, voters: [...pollData.voters, user.uid] } : p));
            alert('Vote recorded!');
        } catch (error) {
            console.error('Error updating document:', error);
            alert('Failed to record vote');
        }
    };

    return (
        <div className="polls-container">
            {!filterCategory && (
                <div className="category-buttons">
                {['all', 'courses', 'housing', 'food', 'others'].map(category => (
                    <button key={category} onClick={() => setSelectedCategory(category)} className={selectedCategory === category ? "selected" : ""}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                ))}
            </div>
            )}
            {filterCategory && (
                <div className="poll-topic">
                        {filterCategory.charAt(0).toUpperCase() + filterCategory.slice(1)}
                </div>
            )}
            <div className="polls-grid">
                {polls.filter(poll => filterCategory ? poll.category === filterCategory : selectedCategory === 'all' || poll.category === selectedCategory).map(poll => (
                    <div key={poll.id} className="poll-container">
                        <h3>{poll.title} - {poll.category ? poll.category.charAt(0).toUpperCase() + poll.category.slice(1) : 'Unknown'}</h3>
                        <ul>
                            {poll.options.map((option, index) => (
                                <li key={index}>
                                    <div>{option.option}: {option.votes} votes</div>
                                    <button className='vote-button'onClick={() => handleVote(poll.id, index)}>Vote</button>
                                    <div className="vote-bar" style={{ width: `${poll.totalVotes ? (option.votes / poll.totalVotes * 100) : 0}%`, backgroundColor: 'lightgreen', height: '20px', marginBottom: '10px' }}></div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PollList;