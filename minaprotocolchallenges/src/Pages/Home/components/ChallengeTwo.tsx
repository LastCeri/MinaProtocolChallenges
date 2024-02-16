import React, { useState } from 'react';
import Notification, { MessageType } from '../../../ThemeParts/Notification/Notification';

const ChallengeThree = () => {
  const [notification, setNotification] = useState({ show: false, type: MessageType.Info, message: '' });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [highestMessageNumber, setHighestMessageNumber] = useState(0);
  const [currentMessageNumber, setCurrentMessageNumber] = useState('');
  const [agentID, setAgentID] = useState('');
  const [agentXLocation, setAgentXLocation] = useState('');
  const [agentYLocation, setAgentYLocation] = useState('');
  const [checksum, setChecksum] = useState('');

  const handleSubmit = (e:any) => {
    e.preventDefault();

    console.log("Process...");

    setHighestMessageNumber(Math.max(highestMessageNumber, parseInt(currentMessageNumber)));
    setCurrentMessageNumber('');
    setAgentID('');
    setAgentXLocation('');
    setAgentYLocation('');
    setChecksum('');
  };

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  return (
    <>
    <div className="container mx-auto p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Challenge 2 | Work Continues</h2>
    </div>


    <div className="container mx-auto p-6 bg-white shadow-md rounded-md">
    <div className="container">
      <h1>Mina Intelligence Message Verification System</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Message Number"
          value={currentMessageNumber}
          onChange={(e) => setCurrentMessageNumber(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Agent ID"
          value={agentID}
          onChange={(e) => setAgentID(e.target.value)}
        />
        <input
          type="number"
          placeholder="Agent X Location"
          value={agentXLocation}
          onChange={(e) => setAgentXLocation(e.target.value)}
        />
        <input
          type="number"
          placeholder="Agent Y Location"
          value={agentYLocation}
          onChange={(e) => setAgentYLocation(e.target.value)}
        />
        <input
          type="text"
          placeholder="Checksum"
          value={checksum}
          onChange={(e) => setChecksum(e.target.value)}
        />
        <button type="submit">Verify Message</button>
      </form>
      <div>Highest Message Number Processed: {highestMessageNumber}</div>
    </div>
    </div>

    <div className="container mx-auto p-6 bg-white shadow-md rounded-md">
        {/* Buton ekleme */}
        <button
            className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
            onClick={openPopup}
        >
            See Details
        </button>

        {/* Popup */}
        {isPopupOpen && (
            <div className="fixed z-10 inset-0 overflow-y-auto">
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                 
                    <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
                    
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">Details Challenge-2</h3>
                                    <img src="#" alt="#" className="w-full object-cover h-48 rounded-md mt-4" />
                                        <p className="text-sm text-blue-500 mt-2">Github URL: <a href='#' target='_blank'>LastCeri/MinaProtocol/Challenges/Challenge-2</a></p>
                                        <p className="text-sm text-green-500 mt-2">Tests: Continues ⌛</p>
                                        <p className="text-sm text-orange-500 mt-2">Time:⌛</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                                type="button"
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                onClick={closePopup}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>

    {notification.show && <Notification type={notification.type} message={notification.message} />}
    </>
);
};

export default ChallengeThree;
