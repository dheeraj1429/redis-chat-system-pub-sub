"use client";
import { useState } from "react";
import { useSocket } from "../context/SocketProvider";

const Page = () => {
  const [message, setMessage] = useState("");
  const { sendMessage } = useSocket();

  return (
    <div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        type="text"
        placeholder="type your text."
      />
      <button onClick={() => sendMessage(message)}>Send</button>
    </div>
  );
};

export default Page;
