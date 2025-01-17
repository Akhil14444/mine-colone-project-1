import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setSocket, clearSocket } from "./redux/socketSlice";
import { setOnlineUsers } from "./redux/chatSlice";
import { setLikeNotification } from "./redux/rtnSlice";

function App() {
  const { user } = useSelector((store) => store.auth);
  const { socketId } = useSelector((store) => store.socketio);
  const dispatch = useDispatch();
  const [socket, setSocketInstance] = useState(null);

  useEffect(() => {
    if (user) {
      console.log("Connecting to WebSocket...");
      const socketio = io("http://localhost:8000", {
        query: { userId: user?._id },
        transports: ["websocket", "polling"],
        reconnectionAttempts: 5, // Retry up to 5 times
        reconnectionDelay: 3000, // Wait 3 seconds between retries
      });

      setSocketInstance(socketio);
      dispatch(setSocket({ socketId: socketio.id, userId: user._id }));

      socketio.on("connect", () => {
        console.log("WebSocket connected:", socketio.id);
      });

      socketio.on("connect_error", (error) => {
        console.error("WebSocket connection error:", error);
      });

      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on("notification", (notification) => {
        dispatch(setLikeNotification(notification));
      });

      return () => {
        console.log("Disconnecting WebSocket...");
        socketio.close();
        dispatch(clearSocket());
        setSocketInstance(null);
      };
    } else if (socket) {
      socket.close();
      dispatch(clearSocket());
      setSocketInstance(null);
    }
  }, [user, dispatch]);

  return <h1>My App</h1>;
}

export default App;
