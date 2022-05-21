import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import moment from "moment";
import Picker from "emoji-picker-react";

function Chat({ socket, userName, room, setShowChat }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [showPicker, setShowPicker] = useState(false);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: userName,
        message: currentMessage,
        time: moment().format("DD/MM HH:mm"),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
      setShowPicker(false);
    }
  };

  const onEmojiClick = (event, emojiObject) => {
    setCurrentMessage((prevInput) => prevInput + emojiObject.emoji);
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="chat-window">
      <div className=" chat-header">
        <div className="h-100 container d-flex align-items-center justify-content-between ">
          <p>Olá, {userName}</p>
          <div className="d-flex align-items-center justify-content-center">
            <button
              className="btn btn-success btn-back me-3"
              onClick={() => setShowChat(false)}
            >
              <i className="fa fa-arrow-left"></i>
            </button>
            <p>Chat - {room}</p>
          </div>
        </div>
      </div>

      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent, index) => {
            return (
              <div
                className="message"
                id={userName === messageContent.author ? "you" : "other"}
                key={index}
              >
                <div>
                  <div className="message-card">
                    {userName !== messageContent.author && (
                      <p id="author">{messageContent.author}</p>
                    )}
                    <p id="message-content">{messageContent.message}</p>
                  </div>
                  <p id="time">{messageContent.time}</p>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      {showPicker && (
        <Picker pickerStyle={{ width: "100%" }} onEmojiClick={onEmojiClick} />
      )}
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Digite sua mensagem"
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <img
          className="emoji-icon"
          alt="true"
          src="https://icons.getbootstrap.com/assets/icons/emoji-smile.svg"
          onClick={() => setShowPicker((val) => !val)}
        />
        <button onClick={sendMessage}>
          <i className="fa fa-send"></i>
        </button>
      </div>
    </div>
  );
}

export default Chat;
