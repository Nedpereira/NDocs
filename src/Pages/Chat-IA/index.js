import React, { useEffect, useState, useRef } from "react";
import runChat from "../../Api/Run-Chat";
import "./style.css";
import formatMessage from "../../Helpers/Format-Message";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Lottie from "react-lottie";
import loading from "../../Assets/Loading/loading.json";
import CustomSnackbar from "../../Components/Custom-Snackbar";

function ChatIA() {
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isStopped, setIsStopped] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [messageSnackBar, setMessageSnackBar] = useState("");
  const [severity, setSeverity] = useState("");

  const defaultOptions = {
    loop: true,
    autoplay: false,
    animationData: loading,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const sendMessage = async () => {
    playAnimation();
    if (!userInput.trim()) return;
    const newMessage = { id: Date.now(), text: userInput, sender: "user" };
    setMessages([...messages, newMessage]);

    try {
      const response = await runChat(userInput);
      if (response) {
        const replyMessage = {
          id: Date.now(),
          text: response,
          sender: "api",
        };
        stopAnimation();
        setMessages((currentMessages) => [...currentMessages, replyMessage]);
      }
    } catch (error) {
      stopAnimation();
      setOpenSnackBar(true);
      setSeverity("error");
      setMessageSnackBar(
        "Ops! Algo deu errado. Por favor, tente enviar sua mensagem novamente."
      );
    }

    setUserInput("");
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const handleClear = () => {
    setMessages([]);
    stopAnimation();
    setOpenSnackBar(true);
    setSeverity("info");
    setMessageSnackBar("Messagens deletadas!");
  };

  const playAnimation = () => {
    setIsStopped(false);
    setIsPaused(false);
  };

  const stopAnimation = () => {
    setIsStopped(true);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleCloseSnackbar = () => {
    setOpenSnackBar(false);
  };

  return (
    <div className="chat-container">
      <CustomSnackbar
        open={openSnackBar}
        handleClose={handleCloseSnackbar}
        message={messageSnackBar}
        severity={severity}
      />
      <button className="button-clear" onClick={handleClear}>
        <DeleteForeverIcon className="icon-delete" sx={{ color: "white" }} />
      </button>
      <div className="messages-area">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.sender === "api" ? formatMessage(msg.text) : msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-area">
        <textarea
          className="input"
          type="text"
          value={userInput}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Digite sua mensagem aqui..."
        />
        <button className="button-send" onClick={sendMessage}>
          <Lottie
            isStopped={isStopped}
            isPaused={isPaused}
            options={defaultOptions}
            height={50}
            width={50}
          />
        </button>
      </div>
    </div>
  );
}

export default ChatIA;