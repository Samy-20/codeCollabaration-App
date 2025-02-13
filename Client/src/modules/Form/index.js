import React, { useState } from "react";
import Icon from "../../Assets/collaboration.png";
import Button from "../../Components/button";
import Input from "../../Components/Input";
import { v4 as uuid } from 'uuid';
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Form() {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  const generateRoomId = (e) => {
    e.preventDefault();
    const Id = uuid();
    setRoomId(Id);
    toast.success("Room Id is generated");
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("Both the field is requried");
      return;
    }

    // redirect
    navigate(`/${roomId}`, {
      state: {
        username,
      },
    });
    toast.success("room is created");
  };

  // when enter then also join
  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();
    joinRoom(); // Call joinRoom to handle the submission
  };

  return (
    <div className="h-screen bg-slate-950 flex items-center justify-center">
      <div className="h-[600px] w-[800px] flex flex-col justify-center items-center bg-slate-900 rounded-2xl shadow-lg border border-white">
        <div className="flex-col flex items-center justify-center mb-5">
          <div className="text-6xl flex items-center justify-center gap-3">
            <img src={Icon} height={75} width={75} alt="Icon" />
            <p className="font-extrabold text-white">Welcome</p>
          </div>
          <p className="text-4xl font-light text-white">Sign in to connect</p>
        </div>

        <form onSubmit={handleSubmit} className="w-1/2">
          <Input
            label="Room ID"
            placeholder="Enter the Room ID"
            className="mb-3"
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            onKeyUp={handleInputEnter}
          />

          <Input
            label="User Name"
            placeholder="Enter the User Name"
            className="mb-3"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyUp={handleInputEnter}            
          />

          <Button 
            className="mt-2 font-extrabold" 
            label="Connect"
            type="submit" // Ensure the button is of type submit
            onClick={joinRoom}
          />
          
          <p className="flex justify-center items-center text-white">
            If you do not have a Room ID{" "}
            <span className="text-blue-800 cursor-pointer underline" onClick={generateRoomId}>
              Generate Room ID
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Form;