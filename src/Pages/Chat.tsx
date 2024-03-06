import * as signalR from "@microsoft/signalr";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";

interface IMessage {
  userId: string;
  content: string;
  sendAt: string;
  roomId: string;
}

const Chat: React.FC = () => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [message, setMessage] = useState<string>("");
  const token = localStorage.getItem("token");

  let userDecoded: any = null;
  if (token) {
    try {
      userDecoded = jwtDecode(token);
    } catch (error) {
      console.error("Token decoding failed", error);
    }
  }

  useEffect(() => {
    if (token) {
      const connect = new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:5284/chatHub", {
          accessTokenFactory: () => Promise.resolve(token),
        })
        .configureLogging(signalR.LogLevel.Information)
        .build();

      connect
        .start()
        .then(() => {
          console.log("Connected!");
          connect
            .invoke("JoinRoom", userDecoded.given_name, "room1")
            .catch((error) => console.error(error));

          connect.on("ReceiveMessage", (message: IMessage) => {
            setMessages((prevMessages) => [...prevMessages, message]);
          });

          connect.on("RoomJoined", (roomMessage: string) => {
            console.log(roomMessage);
          });

          connect.on("UserJoined", (userMessage: string) => {
            console.log(userMessage);
          });
        })
        .catch((err) => console.error("Connection failed: ", err));

      setConnection(connect);

      return () => {
        connect.stop();
      };
    }
  }, [token]);

  const sendMessage = async () => {
    if (connection && message.trim()) {
      await connection
        .invoke("SendMessage", userDecoded.sub, "room1", message)
        .catch((err) => console.error("Send message failed:", err));
      setMessage("");
    }
  };

  return (
    <div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>

      <ul style={{ listStyleType: "none", padding: 0 }}>
        {messages.map((m, index) => (
          <li
            key={index}
            style={{
              textAlign: m.userId === userDecoded.sub ? "right" : "left",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "5px 10px",
                borderRadius: "10px",
                backgroundColor:
                  m.userId === userDecoded.sub ? "#DCF8C6" : "#EAEAEA",
              }}
            >
              {m.content}
            </div>
            <small>{new Date(m.sendAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Chat;
