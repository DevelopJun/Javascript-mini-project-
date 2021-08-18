const socket = io(); // io 는 socket.io/socket.io.js 에서 지원해주는 연결 함수 ㅇㅇ
const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room")

room.hidden = true;


let roomName;


function handleMessageSubmit(event){
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message", input.value, roomName, () => {
        addMEssage(`You: ${value}`);
    });
    input.value = "";
}


function handleNicknameSubmit(event){
    event.preventDefault();
    const input = room.querySelector("#name input");
    socket.emit("nickname", input.value)
}


function showRoom(){
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;

    const msgForm = room.querySelector("#msg");
    const nameForm = room.querySelector("#name");
    msgForm.addEventListener("submit", handleMessageSubmit);
    nameForm.addEventListener("submit", handleNicknameSubmit);
}


function addMEssage(message){
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = `${message}`;
    ul.appendChild(li);
}



function handleRoomSubmit(event){
    event.preventDefault();
    const input = form.querySelector("input");
    // 여태까지는 JSON을 String 문자열로 바꿨는데 socket io는 그냥 뒤에 아무거나 상관없음.
    socket.emit(
        "enter_room", 
        roomName = input.value,
        showRoom // emit은 항상 마지막에 함수 와야함,
        ); // object로 만들어줌 string 아니여도 괜춘함. 
    input.value = ""
}


form.addEventListener("submit", handleRoomSubmit);


socket.on("welcome", (user, newCount)=>{
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${newCount})`;
    addMEssage(`${user} arrived!`);
})

socket.on("bye", (left, newCount)=>{
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${newCount})`;
    addMEssage(`${left} left ㅠㅠ`);
})

socket.on("new_message", addMEssage);

socket.on("room_change", (rooms)=>{
    const roomList = welcome.querySelector("ul");
    roomList.innerHTML = "";
    if(rooms.length === 0){
        return;
    }
    rooms.forEach(room => {
        const li = document.createElement("li");
        li.innerText = room;
        roomList.append(li);
    });
});


