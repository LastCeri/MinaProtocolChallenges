import React, { useState } from 'react';
import Notification, { MessageType } from '../../../ThemeParts/Notification/Notification';
import { SmartContract, PublicKey } from 'o1js';
import {MessageContract}  from '../../../Challenges/Challenge-1/MessageContract';

const contractAddress = 'YOUR_CONTRACT_ADDRESS';

const ChallengeOne = () => {
    const [notification, setNotification] = useState({ show: false, type: MessageType.Info, message: '' });
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [userwalletadress, setWalletAdress] = useState('');
    const [userwalletadress2, setWalletAdress2] = useState('');   
    const [message, setMessage] = useState('');

    const openPopup = () => setIsPopupOpen(true);
    const closePopup = () => setIsPopupOpen(false);

    const handleAddAuthorizedSubmit = async (event:any) => {
        event.preventDefault();
    
        if (!userwalletadress.trim()) {
            showNotification(MessageType.Error, "User Wallet Address is required!");
            return;
        }
        
        try {
            //const publicKey = new PublicKey(userwalletadress);
            //const contract = new MessageContract(new PublicKey(contractAddress));
            //await contract.addEligibleAddress(publicKey);
            showNotification(MessageType.Success, "User added to the smart contract");
            console.log('User added:', { userwalletadress });
            setWalletAdress('');
        } catch (error) {
            console.error("Failed to add user or initialize the contract:", error);
            showNotification(MessageType.Error, "Failed to add user to the smart contract");
        }
    };
    



    const handleAuthorizedSendingMessageSubmit = (event:any) => {
        event.preventDefault();
        if (!userwalletadress.trim() || !message.trim()) {
            showNotification(MessageType.Error, "Both userwalletadress and message are required!");
            return;
        }
        showNotification(MessageType.Success, "Sending Message");
        console.log('handleAuthorizedSendingMessageSubmit added:', { userwalletadress, message });
        setWalletAdress('');
        setMessage('');
    };

    const showNotification = (type:any, message:any) => {
        setNotification({ show: true, type, message });
        setTimeout(() => setNotification({ show: false, type: notification.type, message: '' }), 3500);
      };

    return (
        <>
        <div className="container mx-auto p-6 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Challenge 1 | UI not yet connected | Check out the details</h2>
            <div className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-md">
                <span className="text-sm font-medium text-gray-700">Authorized User Count:</span>
                <span className="text-sm font-semibold text-indigo-600">0/100</span>
            </div>
            <div className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-md">
                <span className="text-sm font-medium text-gray-700">Message Count:</span>
                <span className="text-sm font-semibold text-indigo-600">0</span>
            </div>
        </div>


        <div className="container mx-auto p-6 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Add Authorized User</h2>
            <form onSubmit={handleAddAuthorizedSubmit} className="space-y-4">
                <div>
                    <label htmlFor="AuthorizedUserwalletadress" className="block text-sm font-medium text-gray-700">User Wallet Adress:</label>
                    <input
                        id="AuthorizedUserwalletadress"
                        type="text"
                        value={userwalletadress}
                        onChange={(e) => setWalletAdress(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Add Authorized Address
                </button>
            </form>
        </div>

        <div className="container mx-auto p-6 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Authorized User Message Sending</h2>
            <form onSubmit={handleAuthorizedSendingMessageSubmit} className="space-y-4">
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">User Message:</label>
                    <input
                        id="message"
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <label htmlFor="Authorized Wallet Adress" className="block text-sm font-medium text-gray-700">Authorized Wallet Adress:</label>
                    <input
                        id="walletadress"
                        type="text"
                        value={userwalletadress2}
                        onChange={(e) => setWalletAdress2(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Send Message
                </button>
            </form>
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
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">Details Challenge-1</h3>
                                        <img src="https://cdn.discordapp.com/attachments/1201873313350299698/1201873344522100766/Challenge-1-test.PNG" alt="Popup Resmi" className="w-full object-cover h-48 rounded-md mt-4" />
                                            <p className="text-sm text-blue-500 mt-2">Github URL: <a href='https://github.com/LastCeri/MinaProtocolChallenges/tree/main/minaprotocolchallenges/src/Challenges/Challenge-1' target='_blank'>LastCeri/MinaProtocol/Challenges/Challenge-1</a></p>
                                            <p className="text-sm text-green-500 mt-2">Tests: 11 passed ✅</p>
                                            <p className="text-sm text-orange-500 mt-2"> 122.424s ⌛</p>
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

export default ChallengeOne;
