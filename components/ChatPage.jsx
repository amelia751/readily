import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { FaPaperPlane } from "react-icons/fa";

const ChatPage = ({ mapID, chatHistory, setChatHistory }) => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    const fetchTherapyInfo = async () => {
      try {
        const res = await fetch(`/api/therapy/${mapID}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.error);
        }
      } catch (error) {
        setError('Failed to fetch therapy information: ' + error.message);
      }
    };

    const initiateChat = async () => {
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: 'Start conversation', history: [], mapID }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || `Error: ${res.statusText}`);
        }

        const data = await res.json();
        setChatHistory(data.history);
      } catch (error) {
        setError(error.message || 'An unknown error occurred');
      }
    };

    fetchTherapyInfo();
    initiateChat();
  }, [mapID, setChatHistory]);

  const handleSendMessage = async () => {
    if (message.trim() === '') return;

    const currentMessage = { role: 'user', content: message };
    setMessage('');
    setIsThinking(true);

    setChatHistory(prevHistory => [
      ...prevHistory,
      currentMessage
    ]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: currentMessage.content, history: [...chatHistory, currentMessage], mapID }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || `Error: ${res.statusText}`);
      }

      const data = await res.json();
      const formattedHistory = data.history.map(msg => {
        if (msg.role === 'system') {
          msg.content = msg.content.replace(/\*\*(.*?)\*\*/g, '**$1**').replace(/\*(.*?)\*/g, '*$1*');
        }
        return msg;
      });

      setChatHistory(formattedHistory);
    } catch (error) {
      setError(error.message || 'An unknown error occurred');
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col items-center justify-start h-screen">
      <div className="flex flex-col justify-between w-full max-w-xl bg-white rounded-lg p-4 h-5/6 mx-2 border-2 border-[#FE9900]">
        <div className="flex-grow overflow-y-auto mb-4">
          {chatHistory.map((chat, index) => (
            <div
              key={index}
              className={`p-2 mb-2 rounded-lg max-w-lg ${
                chat.role === 'user' ? 'bg-gradient-to-r from-[#FF7A01] to-[#FE9900] text-white self-end' : 'border-2 border-[#FE9900] self-start'
              }`}
            >
              {chat.role === 'system' ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {chat.content}
                </ReactMarkdown>
              ) : (
                chat.content
              )}
            </div>
          ))}
          {isThinking && (
            <div className="flex items-center justify-center p-2 mb-2 max-w-lg bg-gray-200 text-gray-800 self-start">
              <div className="typing-indicator">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center mb-4 space-x-2 pt-2">
          <Textarea
            className="flex-grow h-16 p-2 bg-gray-100 resize-none border-none"
            placeholder="Aa"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          ></Textarea>
          <Button className="rounded-full h-12 bg-gradient-to-r from-[#FF7A01] to-[#FE9900] hover:from-black hover:to-black hover:text-[#FE9900]" onClick={handleSendMessage}>
            <FaPaperPlane />
          </Button>
        </div>
        {error && <div className="text-red-500 text-center mt-2">{error}</div>}
      </div>
      <style jsx>{`
        .typing-indicator {
          display: flex;
          align-items: center;
        }
        .dot {
          height: 8px;
          width: 8px;
          margin: 0 4px;
          background-color: #333;
          border-radius: 50%;
          display: inline-block;
          animation: dot-blink 1.4s infinite both;
        }
        .dot:nth-child(1) {
          animation-delay: 0s;
        }
        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes dot-blink {
          0% {
            opacity: 0.2;
          }
          20% {
            opacity: 1;
          }
          100% {
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatPage;
