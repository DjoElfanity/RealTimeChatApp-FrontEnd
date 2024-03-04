import * as signalR from "@microsoft/signalr";
import React, { useEffect, useState } from "react";

interface IMessage {
  user: string;
  message: string;
}

const Chat: React.FC = () => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const connect = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5284/chatHub") // Remplacez par l'URL de votre Hub SignalR
      .configureLogging(signalR.LogLevel.Information)
      .build();

    setConnection(connect);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("Connected!");

          connection.on(
            "ReceiveMessage",
            (user: string, receivedMessage: string) => {
              setMessages((messages) => [
                ...messages,
                { user, message: receivedMessage },
              ]);
            }
          );
        })
        .catch((err) => console.error("Connection failed: ", err));
    }
  }, [connection]);

  const sendMessage = async () => {
    if (connection) await connection.invoke("SendMessage", "room1", message); // Adaptez 'room1' selon votre besoin
    setMessage("");
  };

  return (
    <div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>

      <ul>
        bonjour
        {messages.map((m, index) => (
          <li key={index}>
            {m.user}: {m.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Chat;
