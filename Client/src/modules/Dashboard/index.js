import React, { useEffect, useRef, useState } from "react";
import Client from "../../modules/Client/Client";
import Editor from "../../Components/Editor/index";
import { initSocket } from "../../Socket";
import { ACTIONS } from "../../Action";
import Icon from "../../Assets/collaboration.png";
import "./style.css";

import {
  useNavigate,
  useLocation,
  Navigate,
  useParams,
} from "react-router-dom";
import { toast } from "react-hot-toast";

// List of supported languages
const LANGUAGES = [
  "python3",
  "javascript",
  "java",
  "cpp",
  "c",
  "nodejs",
  "ruby",
  "go",
  "scala",
  "bash",
  "sql",
  "pascal",
  "csharp",
  "php",
  "swift",
  "rust",
  "r",
];

function Dashboard() {
  const [clients, setClients] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("python3");
  const codeRef = useRef(null);

  const Location = useLocation();
  const navigate = useNavigate();
  const { roomId } = useParams();
  console.log("Room ID:", roomId);

  const socketRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      const handleErrors = (err) => {
        console.log("Error", err);
        toast.error("Socket connection failed, Try again later");
        navigate("/");
      };

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: Location.state?.username,
      });

      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== Location.state?.username) {
            toast.success(`${username} joined the room.`);
          }
          setClients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();

    return () => {
      socketRef.current && socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  if (!Location.state) {
    return <Navigate to="/" />;
  }

  const copyRoomId = async () => {
    try {
      // Check if roomId is not defined
      if (!roomId) {
        throw new Error("Room ID is not defined");
      }
      await navigator.clipboard.writeText(roomId);
      toast.success(`Room ID copied!`);
      console.log(`${roomId}`);
    } catch (error) {
      console.log(error);
      toast.error("Unable to copy the room ID");
    }
  };

  const leaveRoom = async () => {
    navigate("/");
  };

  return (
    // container-fluid vh-100 d-flex flex-column
    <div className="flex ">
      {/* Left part */}
      <div className="w-[15%] h-screen bg-slate-900">
        <div className="flex gap-3 justify-center items-center h-[20vh] text-white my-6">
          <div>
            <img src={Icon} alt="Collaboration Icon" className="h-24 w-24" />
          </div>
          <div>
            <p>Code</p>
            <p>Collaboration</p>
            <p>App</p>
          </div>
        </div>
        <hr className="mx-4" />

        <div className="text-white overflow-auto h-[60vh]">
          <span className="text-2xl m-4 mt-3 mb-[2vh]">Member</span>
          <div className="mt-3 ml-3">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>

        <hr className="mx-4" />

        <div className="h-[20vh] p-2 flex flex-col items-center ">
          <button
            className="bg-green-500 hover:bg-green-700 border-none rounded-sm p-1 mx-4 my-2"
            onClick={copyRoomId}
          >
            Copy Room Id
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 border-none rounded-sm p-1"
            onClick={leaveRoom} // Call exitRoom on click
          >
            Leave Room
          </button>
        </div>
      </div>

      {/* Editor, Right part */}
      <div className="w-[85%] h-screen bg-slate-950">
        <div className="">
          <select
            className="form-select w-auto bg-black text-white border rounded mx-3 hover:bg-slate-800"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        <Editor 
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />
      </div>
    </div>
  );
}

export default Dashboard;
