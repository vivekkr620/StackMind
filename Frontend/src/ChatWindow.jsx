import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";

function ChatWindow() {
  const { prompt, setPrompt, reply, setReply, currThreadId, setPrevChats, setNewChat } = useContext(MyContext);

  // create a new state variable for loader
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const getReply = async () => {
    setLoading(true);

    setNewChat(false);

    console.log("message", prompt, "threadId", currThreadId);

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: prompt,
        // current threadId -> to create a new state variable
        threadId: currThreadId,
      }),
    };
    try {
      // ensure our backend is run, then response will come
      const response = await fetch("http://localhost:8080/api/chat", options);
      const res = await response.json(); // its a reply
      console.log(res);
      setReply(res.reply);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  // Append New Chat to prevChats
  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prevChats) => [
        ...prevChats, {
          role: "user",
          content: prompt,
        },{
          role: "assistant",
          content: reply,
        },

      ]);
      
    }
 
    setPrompt("");
    // [reply, prompt, setPrevChats, setPrompt]
  }, [reply]); 


  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  }



  return (
    <div className="chatWindow">
      {/* 1st component */}
      <div className="navbar">
        <span>
          Stack Mind <i className="fa-solid fa-chevron-down"></i>
        </span>

        {/* clickable icon  */}
        <div className="userIconDiv" onClick={handleProfileClick}>
          <span className="userIcon">
            {" "}
            <i className="fa-solid fa-user"></i>{" "}
          </span>
        </div>

      </div>

      {/* DropDown */}
      {
        isOpen && 
        <div className="dropDown">
          <div className="dropDownItem"> <i className="fa-solid fa-gear"></i> Settings </div>
          <div className="dropDownItem"> <i className="fa-solid fa-cloud-arrow-up"></i> Upgrade Plan</div>
          <div className="dropDownItem"> <i className="fa-solid fa-right-from-bracket"></i> Log out</div>
        </div>
      }








      {/* 2nd - chat component -> it is a individual component */}
      <Chat></Chat>

      <ScaleLoader color="#fff" loading={loading}></ScaleLoader>

      {/* 3rd component */}
      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Ask anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? getReply() : "")}
          />

          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>
        <p className="info">
          Stack Mind can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;
