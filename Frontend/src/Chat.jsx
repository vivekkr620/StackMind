import "./Chat.css";
import { useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark-dimmed.css";

function Chat() {
  const { newChat, prevChats, reply } = useContext(MyContext);
  const [latestReply, setLatestReply] = useState(null);
  
  // Track the previous reply to know when it changes
  const [prevReply, setPrevReply] = useState(reply);

  // 1. Adjust state during render to avoid cascading renders
  if (reply !== prevReply) {
    setPrevReply(reply);
    // When we load a previous chat (reply becomes null), reset latestReply
    if (reply === null) {
      setLatestReply(null);
    }
  }

  useEffect(() => {
    // 2. The effect now ONLY handles the typing interval
    if (reply === null || !prevChats?.length) return;

    const content = reply.split(" "); // individual words

    let idx = 0;
    const interval = setInterval(() => {
      setLatestReply(content.slice(0, idx + 1).join(" ")); // join with individual space 
      
      idx++;
      if (idx >= content.length) clearInterval(interval);
    }, 40); 

    return () => clearInterval(interval);

  }, [prevChats, reply]);

  return (
    <>
      {newChat && <h1>Start a New Chat</h1>}
      <div className="chats">

        {/* Last reply are slice() from prevChats */}
        {
          prevChats?.slice(0, -1).map((chat, idx) => 
            <div className={chat.role === "user" ? "userDiv" : "stackMindDiv"} key={idx}>
              {
                // depending upon the value we display here
                chat.role === "user" ? 
                <p className="userMessage">{chat.content}</p> : 
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{chat.content}</ReactMarkdown>
              }                                                                                                    
            </div>
          )
        }

        {
          prevChats.length > 0 && (
            <>
              {
                latestReply === null ? (
                  <div className="stackMindDiv" key={"non-typing"}>
                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{prevChats[prevChats.length-1].content}</ReactMarkdown> 
                  </div>
                ) : (
                  <div className="stackMindDiv" key={"typing"}>
                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{latestReply}</ReactMarkdown> 
                  </div>
                )
              }
            </>
          )
        }

      </div>
    </>
  );
}

export default Chat;
