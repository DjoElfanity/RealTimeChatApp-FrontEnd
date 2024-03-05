import * as signalR from "@microsoft/signalr";
import { jwtDecode } from "jwt-decode"; // Assurez-vous que l'importation est correcte
import React, { useEffect, useState } from "react";

// Ajustement de l'interface pour correspondre à la structure attendue d'un message
interface IMessage {
  userId: string;
  content: string;
  sendAt: string; // Assurez-vous que cette propriété est au format que vous souhaitez afficher
  roomId: string;
}

const Chat: React.FC = () => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [message, setMessage] = useState<string>("");
  const token = localStorage.getItem("token");

  // Tentative de décodage du token avec gestion d'erreur
  let userDecoded: any = null;
  if (token) {
    try {
      userDecoded = jwtDecode(token);
    } catch (error) {
      console.error("Token decoding failed", error);
      // Gérer ici la redirection vers la page de connexion ou afficher une erreur
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
            .invoke("JoinRoom", "room1")
            .catch((error) => console.error(error));

          connect.on("ReceiveMessage", (message: IMessage) => {
            setMessages((prevMessages) => [...prevMessages, message]);
          });

          // Gestion des événements RoomJoined et UserJoined
          connect.on("RoomJoined", (roomMessage: string) => {
            console.log(roomMessage);
          });

          connect.on("UserJoined", (userMessage: string) => {
            console.log(userMessage);
          });
        })
        .catch((err) => console.error("Connection failed: ", err));

      setConnection(connect);

      // Nettoyage de la connexion
      return () => {
        connect.stop();
      };
    }
  }, [token]); // Ajoutez d'autres dépendances si nécessaire

  const sendMessage = async () => {
    if (connection && message.trim()) {
      await connection
        .invoke("SendMessage", "room1", message)
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

      <ul>
        {messages.map((m, index) => (
          <li key={index}>
            {m.userId}: {m.content}{" "}
            <small>{new Date(m.sendAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Chat;
