import React, { useState, useRef, useEffect } from 'react';
import { aiEndpoints } from '../../services/apis';
import { apiConnector } from '../../services/apiConnector';
import { useSelector } from 'react-redux';
import { IoClose, IoSend } from 'react-icons/io5';
import { useParams } from 'react-router-dom';

const EduBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello! I'm EduBot, your AI teaching assistant. How can I help you today?", isUser: false }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const { token } = useSelector((state) => state.auth);
    const { courseId } = useParams();
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = input;
        setInput("");
        setMessages(prev => [...prev, { text: userMsg, isUser: true }]);
        setLoading(true);

        try {
            const response = await apiConnector("POST", aiEndpoints.AI_CHAT_API,
                { query: userMsg, courseId },
                { Authorization: `Bearer ${token}` }
            );

            if (response.data.success) {
                setMessages(prev => [...prev, { text: response.data.data, isUser: false }]);
            } else {
                setMessages(prev => [...prev, { text: "Sorry, I'm having some trouble responding right now.", isUser: false }]);
            }
        } catch (error) {
            console.error("AI CHAT ERROR:", error);
            setMessages(prev => [...prev, { text: "Connection error. Please try again.", isUser: false }]);
        }
        setLoading(false);
    };

    return (
        <div className="fixed bottom-10 right-10 z-[1000]">
            {/* Chat Icon */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-yellow-50 text-richblack-900 p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-200"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="bg-richblack-800 border border-richblack-700 w-80 sm:w-96 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-in">
                    {/* Header */}
                    <div className="bg-richblack-700 p-4 flex justify-between items-center border-b border-richblack-600">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-caribbeangreen-200 rounded-full animate-pulse"></div>
                            <h3 className="text-richblack-5 font-bold">EduBot AI Assistant</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-richblack-200 hover:text-white">
                            <IoClose size={24} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="h-96 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.isUser
                                        ? 'bg-yellow-50 text-richblack-900 rounded-tr-none'
                                        : 'bg-richblack-700 text-richblack-5 rounded-tl-none border border-richblack-600'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-richblack-700 p-3 rounded-2xl rounded-tl-none animate-pulse text-richblack-200 text-xs">
                                    EduBot is thinking...
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} className="p-4 bg-richblack-900 border-t border-richblack-700 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything..."
                            className="flex-1 bg-richblack-800 text-richblack-5 px-4 py-2 rounded-lg border border-richblack-700 focus:outline-none focus:border-yellow-50"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-yellow-50 text-richblack-900 p-2 rounded-lg hover:bg-yellow-100 disabled:opacity-50"
                        >
                            <IoSend size={20} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default EduBot;
