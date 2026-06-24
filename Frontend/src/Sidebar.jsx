import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
  } = useContext(MyContext);

  const getAllThreads = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/thread");
      const res = await response.json();

      const filteredData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      // console.log(filteredData); // print only threadId and title
      setAllThreads(filteredData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // console.log("Current Thread:", currThreadId);
    getAllThreads();
  }, [currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  // fetch all chat
  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId); // setCurrThreadId is replace with newThreadId

    //load all old chats with is particular threadId (newThreadId)
    try {
      const response = await fetch(
        `http://localhost:8080/api/thread/${newThreadId}`,
      );
      const res = await response.json();
      console.log(res);
      // setPrevChats
      setPrevChats(res);
      setNewChat(false);

      setReply(null);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteThread = async (threadId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/thread/${threadId}`,
        { method: "DELETE" },
      );
      const res = await response.json();
      console.log(res);

      // updated thread re-render
      setAllThreads((prev) =>
        prev.filter((thread) => thread.threadId != threadId),
      );

      // create newChat if curr chat is deleted
      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="sidebar">
      {/* new chat button */}
      <button onClick={createNewChat}>
        <img src="src/assets/SM-logo.png" alt="gpt logo" className="logo" />
        <span>
          {" "}
          <i className="fa-solid fa-pen-to-square"></i>{" "}
        </span>
      </button>

      {/* history - previous history*/}
      <ul className="history">
        {/* if data is exist */}
        {allThreads?.map((thread, idx) => (
          // pass newThreadId
          <li
            key={idx}
            onClick={() => changeThread(thread.threadId)}
            className={thread.threadId === currThreadId ? "highlighted" : " "}
          >
            {thread.title}

            {/* delete icon  */}
            <i
              className="fa-solid fa-trash"
              onClick={(e) => {
                e.stopPropagation(); // to stop event bubbling
                deleteThread(thread.threadId);
              }}
            ></i>
          </li>
        ))}
      </ul>

      {/* sign */}
      <div className="sign">
        <p>By StackMind</p>
      </div>
    </section>
  );
}

export default Sidebar;
