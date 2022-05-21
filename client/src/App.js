import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";

const socket = io.connect("http://localhost:3001");

function App() {
  const [userName, setUserName] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (userName !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <div className="card-join">
          <h4>
            <b>Login</b>
          </h4>
          <div className="w-100 text-start mb-3">
            <label for="nameInput" class="form-label m-0">
              Nome
            </label>
            <input
              type="text"
              id="nameInput"
              className="form-control p-2 "
              onChange={(event) => {
                setUserName(event.target.value);
              }}
            />
          </div>
          <div className="w-100 text-start mb-3">
            <label for="roomInput" class="form-label m-0">
              Sala
            </label>

            <input
              type="text"
              id="roomInput"
              className="form-control p-2"
              onChange={(event) => {
                setRoom(event.target.value);
              }}
            />
          </div>

          <button className="btn btn-success" onClick={joinRoom}>
            ENTRAR
          </button>
        </div>
      ) : (
        <Chat
          socket={socket}
          userName={userName}
          room={room}
          setShowChat={setShowChat}
        />
      )}
    </div>
  );
}

export default App;
