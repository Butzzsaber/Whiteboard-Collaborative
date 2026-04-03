import { io } from "socket.io-client";

let socket;

export const connectedWithSocketServer = () => {
    socket  = io("http://localhost:5000/");

    socket.on("connect", () => {
        console.log("connected to socket server"); 
      });
};
