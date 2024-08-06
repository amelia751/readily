"use client";

import React from 'react';
import ChatPage from './ChatPage';
import { PanelRightOpen, PanelRightClose } from 'lucide-react';

const RightSidebar: React.FC<{ mapID: string; isVisible: boolean; toggleVisibility: () => void; chatHistory: any[]; setChatHistory: any }> = ({ mapID, isVisible, toggleVisibility, chatHistory, setChatHistory }) => {
  return (
    <div
      className={`fixed top-0 right-0 h-screen transition-all duration-300 bg-white z-100 ${
        isVisible ? 'w-96' : 'w-0'
      }`}
    >
      <div className="flex flex-col justify-between h-full bg-white">
        <div>
          <div className="p-4 flex items-center justify-between">
            <h2 className={`text-2xl font-bold text-black ${!isVisible && 'hidden'}`}>Gemini Chatbot</h2>
            <button onClick={toggleVisibility} className="text-black">
              {isVisible ? <PanelRightClose className="h-6 w-6" /> : <PanelRightOpen className="h-6 w-6" />}
            </button>
          </div>
          {isVisible && (
            <div className="px-3">
              <ChatPage mapID={mapID} chatHistory={chatHistory} setChatHistory={setChatHistory} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
