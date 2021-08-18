/*
** 서버 실행하는 방법은 npm run dev 
*/

import http from "http";
import {Server} from "socket.io";
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



const handleListen = () => console.log("Listening on http://localhost:3000");

const httpServer = http.createServer(app); // http 서버이고, 

const wsServer = new Server(httpServer, {
    cors: {
        origin: ["https://admin.socket.io"],
        credentials: true
      }
}); // Backend socket io 설치

instrument(wsServer, {
    auth: false
  });
  


function publicRooms(){
    const {
        sockets: {
            adapter: {sids, rooms},
        },
    } = wsServer;
    // 이기 위에랑 같은 말임.
    // const sids = wsServer.sockets.adapter.sids;
    // const rooms = wsServer.sockets.adapter.rooms;
    const publicRooms = [];
    rooms.forEach((_, key)=>{
        if(sids.get(key) === undefined){
            publicRooms.push(key);
        }
    });
    return publicRooms;

}

function countRoom(roomName){
    return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}


wsServer.on("connection", (socket)=>{
    socket["nickname"] = "Anonymous"
    socket.onAny((event)=>{
        console.log(wsServer.sockets.adapter);
        console.log(`socket Event: ${event}`);
    })
    
    socket.on("enter_room", (roomName, done)=> {
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
        wsServer.sockets.emit("room_change", publicRooms());
    });
    socket.on("disconnecting", ()=>{
        socket.rooms.forEach(room => {
            socket.to(room).emit("bye", socket.nickname, countRoom(room)-1);
        });
    });

    socket.on("disconnect", ()=>{
        wsServer.sockets.emit("room_change", publicRooms());
    });

    socket.on("new_message", (msg, room, done)=>{
        console.log("여기 들어와야 하는데");
        socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
        done();
    });
    socket.on("nickname", (nickname)=>(socket["nickname"]) = nickname);
});









/* websoket 코드임 
const wws = new WebSocket.Server({ server }) // webSocket 서버인거지,  이제 그럼 저 위에 http 서버가 시작되면, websocket 서버도 실행된다는 의미로 { server }을 넣게 된거임.
const sockets = [];

wws.on("connection", (socket)=>{
    sockets.push(socket);
    socket["nickname"] = 'Anon'
    console.log("Connected to Browser");
    socket.on("close", ()=>{
        console.log("Disconnected from Browser ❌ ");
    });
    socket.on("message", (msg) =>{
        const message = JSON.parse(msg);
        console.log(message, msg.toString('utf-8'));
        switch(message.type){
            case "new_massage":
                sockets.forEach((aSocket) => 
                    aSocket.send(`${socket.nickname} : ${message.payload}`)
                );                
            case "nickname":
                socket["nickname"] = message.payload;
            }
        // tostring 사용 안하면 에러 발생 제대로 data 가지 않는다.
    });
}); // 이거 js 이벤트 호출이랑 유사하고, 저 connection 왔을때 func 주는거고, 몇가지 없으니까 쉬운 개념 

*/

httpServer.listen(3000, handleListen);

