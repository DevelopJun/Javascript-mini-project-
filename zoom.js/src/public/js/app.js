const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageform = document.querySelector("#message");
const socket = new WebSocket(`ws://${window.location.host}`) // 백엔드랑 지금 프론트 여기랑 연결 시켜주는 부분 

function makeMessage(type, payload){
    const msg = {type, payload}; // 여기서 신기한게, payload : payload 인데 어떻게 저런 json 객체가 나오지
    return JSON.stringify(msg)
}

socket.addEventListener("open", ()=>{
    console.log("Connected to Server ✔");
})

/* 이게 바로 위에랑 똑같은 개념 function을 분리할거냐 말거냐의 차이.
function handleOpen(){
    console.log("Connected to Server ✔");
}

socket.addEventListener("open", handleOpen);
*/


socket.addEventListener("message", (message)=>{
    const li = document.createElement("li");
    console.log(message.data);
    li.innerText = message.data;
    messageList.append(li);
    // console.log("New message:", messsage.data);
})

socket.addEventListener("close", ()=>{
    console.log("Disconnected from server ❌ ");
})

function handleSubmit(event){
    event.preventDefault(); // 문서참조.
    const input = messageform.querySelector("input");
    socket.send(makeMessage("new_massage", input.value));
    input.value = "";
}

function handleNickSubmit(event){
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(makeMessage("nickname", input.value)); // 전송하는건 string 형태인거지. object -> string Json stringfy 이용해서.
    input.value = "";
}

messageform.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);

