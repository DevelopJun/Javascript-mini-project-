/*
** 서버 실행하는 방법은 npm run dev 
*/

import http from "http";
import SocketIO from "socket.io";
import WebSocket from "ws";
import express from "express";
import { instrument } from "@socket.io/admin-ui";
// const express = require('express'); 이렇게 작동시켜도 된다. 

const app = express();


app.set("view engine", "pug"); // express 객체와 pug를 연결 
app.set("views", __dirname + "/views" ); //pug 파일을 읽어올 디렉토리 표시 

app.use("/public", express.static(__dirname + "/public"));

app.get("/", (_, res) => res.render("home")); // 일단 먼저 / 라우트 경로가 home으로 가게 설정함.
app.get("/*", (_, res) => res.redirect("/")); 



const httpServer = http.createServer(app); // http 서버이고, 
const wsServer = SocketIO(httpServer);

wsServer.on("connection", socket=>{
    socket.on("join_room", (roomName, done)=>{
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome");
    });
});

const handleListen = () => console.log("Listening on http://localhost:3000");
httpServer.listen(3000, handleListen);

