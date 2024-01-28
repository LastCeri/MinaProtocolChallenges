import React, { useState } from 'react';
import Notification, { MessageType } from '../../../ThemeParts/Notification/Notification';
import { SmartContract, PublicKey } from 'o1js';
import SecretMessageContract from '../../../Challenges/Challenge-1/SecretMessageContract';

const contractAddress = 'YOUR_CONTRACT_ADDRESS';

const ChallengeOne = () => {
    const [notification, setNotification] = useState({ show: false, type: MessageType.Info, message: '' });
    const [userwalletadress, setWalletAdress] = useState('');
    const [userwalletadress2, setWalletAdress2] = useState('');
    
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const contract = new SecretMessageContract(new PublicKey(contractAddress));

    const handleAddAuthorizedSubmit = async (event:any) => {
        event.preventDefault();
        if (!userwalletadress.trim()) {
            showNotification(MessageType.Error, "Both User Wallet Adress are required!");
            return;
        }
        const publicKey = new PublicKey(userwalletadress);
        
        await contract.addEligibleAddress(publicKey);
        
        showNotification(MessageType.Success, "User added to the smart contract");
        console.log('User added:', { userwalletadress });
        setWalletAdress('');
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
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Challenge 1</h2>
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
        {notification.show && <Notification type={notification.type} message={notification.message} />}
        </>
    );
};

export default ChallengeOne;
