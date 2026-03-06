import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const socketUrl = typeof window !== "undefined" ? window.location.origin : "";

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const s = io(socketUrl, { path: "/socket.io", transports: ["polling", "websocket"] });
    setSocket(s);
    s.on("connect", () => setConnected(true));
    s.on("disconnect", () => setConnected(false));
    return () => {
      s.close();
      setSocket(null);
      setConnected(false);
    };
  }, []);

  return { socket, connected };
}
