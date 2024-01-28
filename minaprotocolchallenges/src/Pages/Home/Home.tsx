import React, { useState } from 'react';
import ChallengeOne from './components/ChallengeOne';
import ChallengeTwo from './components/ChallengeTwo';
import ChallengeThree from './components/ChallengeThree';

type Challenge = {
  id: number;
  name: string;
};

const challenges: Challenge[] = [
  { id: 1, name: 'Challenge 1' },
  { id: 2, name: 'Challenge 2' },
  { id: 3, name: 'Challenge 3' },
];

type ChallengeComponent = () => React.ReactNode;

const challengeComponents: { [key: number]: ChallengeComponent } = {
  1: ChallengeOne,
  2: ChallengeTwo,
  3: ChallengeThree,
};

const HomePage = () => {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  const renderChallengeContent = () => {
    if (!selectedChallenge) {
        return (
            <div className="flex justify-center items-center mt-40 bg-gray-100">
                <div className="p-6 max-w-sm w-full bg-white rounded-lg border border-gray-200 shadow-md">
                    <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">Choose a Challenge!</h2>
                    <p className="font-normal text-gray-700">Please choose a challenge to get started.</p>
                </div>
            </div>
        );
    }
    
    
    const ChallengeComponent = challengeComponents[selectedChallenge.id];
    return ChallengeComponent ? <ChallengeComponent /> : <div>No component found for this challenge.</div>;
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold mb-4">Monthly Challenges</h1>
        <ul>
          {challenges.map(challenge => (
            <li
              key={challenge.id}
              className={`mb-2 cursor-pointer ${selectedChallenge?.id === challenge.id ? 'bg-gray-700' : ''}`}
              onClick={() => setSelectedChallenge(challenge)}
            >
              {challenge.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="w-3/4 p-4">
        {renderChallengeContent()}
      </div>
    </div>
  );
};

export default HomePage;
