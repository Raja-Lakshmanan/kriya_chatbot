import React from 'react'
import { useRef } from 'react';
import { TiArrowSortedDown } from "react-icons/ti";
import { IoIosArrowUp } from "react-icons/io";
const ChatForm = ({chatHistory , setChatHistory , generateBotResponse}) => {
    const inputref = useRef(null);
    const handleFormSubmit = (e) => {
        e.preventDefault();
        const userMessage = inputref.current.value.trim();
        if(!userMessage)return;
        inputref.current.value = '';
        setChatHistory(history => [...history, { role: 'user', text: userMessage }]);
        setTimeout(() => {
          setChatHistory((history) =>[...history,{role:"model", text:"Thinking..."}]);
          generateBotResponse([...chatHistory, { role: 'user', text: `Using the details provided above, please address this query: ${userMessage}` }]);
        }, 600);
    }
  return (
    <div>
      <form action="" className="chat-form" onSubmit={handleFormSubmit}>
            <input ref={inputref} type="text" placeholder='Message...' className="message-input" required />
            <button type="submit" className="send-button"><IoIosArrowUp/></button>
          </form>
    </div>
  )
}

export default ChatForm
