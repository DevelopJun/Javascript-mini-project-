/*
** 서버 실행하는 방법은 npm run dev 
*/
import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug"); // express 객체와 pug를 연결 
app.set("views", __dirname + "/views" ); //pug 파일을 읽어올 디렉토리 표시 

app.use("/public", express.static(__dirname + "/public"));

app.get("/", (_, res) => res.render("home")); // 일단 먼저 / 라우트 경로가 home으로 가게 설정함.
app.get("/*", (_, res) => res.redirect("/")); 



const handleListen = () => console.log("Listening on http://localhost:3000");
// app.listen(3000, handleListen);

const server = http.createServer(app); // http 서버이고, 
const wws = new WebSocket.Server({ server }) // webSocket 서버인거지,  이제 그럼 저 위에 http 서버가 시작되면, websocket 서버도 실행된다는 의미로 { server }을 넣게 된거임.


const sockets = [];

wws.on("connection", (socket)=>{
    sockets.push(socket);
    console.log("Connected to Browser");
    socket.on("close", ()=>{
        console.log("Disconnected from Browser ❌ ");
    });
    socket.on("message", (message) =>{
        // console.log(message.toString('utf8')); // tostring 사용 안하면 에러 발생 제대로 data 가지 않는다.
        sockets.forEach((aSocket) => aSocket.send(message.toString('utf8')));
    });
}); // 이거 js 이벤트 호출이랑 유사하고, 저 connection 왔을때 func 주는거고, 몇가지 없으니까 쉬운 개념 


server.listen(3000, handleListen);