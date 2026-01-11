import React from 'react'
import { useState , useRef , useEffect} from 'react';
import ChatbotIcon from './components/ChatbotIcon'
import { TiArrowSortedDown } from "react-icons/ti";
import { IoIosArrowUp } from "react-icons/io";
import './App.css'
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import ChatForm from './components/ChatForm';
import ChatMessage from './components/ChatMessage';
import { FaMessage } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { companyInfo } from './companyInfo';

const App = () => {
  const [chatHistory, setChatHistory] = useState([
    {
      hideInChat: true,
      role: "model",
      text: companyInfo
    }
  ]);
  const [showChatbot, setShowChatbot] = useState(false);
  const chatBodyRef = useRef();


  const generateBotResponse = async (history) => {

    const updateHistory = (text, isError = false) => {
      setChatHistory(prev => [...prev.filter(msg => msg.text !== "Thinking..."), {role: 'model', text}]);
    }

    history = history.map(({role,text}) => ({role , parts:[{text}]}));
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: history })
    }

    try{
        const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
        const data = await response.json();
        if(!response.ok) throw new Error(data.error.message || 'Something went wrong');

        const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
        updateHistory(apiResponseText);
    }catch(error){
      updateHistory(error.message,true);
    }
  };

  useEffect(() => {
    chatBodyRef.current.scrollTo({top: chatBodyRef.current.scrollHeight, behavior: 'smooth'});
  }, [chatHistory]);

  return (
    <section className={`container ${showChatbot ? 'show-chatbot' : ''}`}>
      <button onClick={() => setShowChatbot(prev => !prev)} id='chatbot-toggler'>
        <span><FaMessage className='message-icon'/></span>
        <span><IoMdClose className='close'/></span>
      </button>
      <div className='chatbot-popup'>
        <div className='chat-header'>
          <div className='header-info'>
            <ChatbotIcon/>
            <h2 className='logo-text'>Kriya Chatbot</h2>
          </div>
          <button onClick={() => setShowChatbot(prev => !prev)}><MdOutlineKeyboardArrowDown className='arrow-icon'/></button>
        </div>
        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
            <ChatbotIcon/>
            <p className='message-text'>
              Hello there👋<br /> I'm Kriya Chatbot. How can I help you?
            </p>
          </div>

          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
    
        </div>
        {/* chat Footer */}
        <div className="chat-footer">
          <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse}/>
        </div>
      </div>
      
    </section>
  )
}

export default App
