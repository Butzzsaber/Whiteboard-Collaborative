import { io } from "socket.io-client";

// let socket = null;

// export const connectedWithSocketServer = () => {
//     socket  = io("http://localhost:5000/");

//     socket.on("connect", () => {
//         console.log("connected to socket server"); 
//       });
// };

// export const getSocket = () => socket;

export const socket = io("http://localhost:5000");

socket.on("connect", () => {
    socket.on()
  console.log("connected to socket server");
});