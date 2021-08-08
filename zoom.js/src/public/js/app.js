const socket = new WebSocket(`ws://${window.location.host}`) // 백엔드랑 지금 프론트 여기랑 연결 시켜주는 부분 

socket.addEventListener("open", ()=>{
    console.log("Connected to Server ✔");
})

socket.addEventListener("message", (messsage)=>{
    console.log("New message:", messsage.data );
})

socket.addEventListener("close", ()=>{
    console.log("Disconnected from server ❌ ");
})


setTimeout(()=>{
    socket.send("hello form the browser");
}, 10000);