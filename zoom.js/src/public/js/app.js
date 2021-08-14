const socket = io(); // io 는 socket.io/socket.io.js 에서 지원해주는 연결 함수 ㅇㅇ
const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");

function backendDone(msg){
    console.log(`backend message: ${msg}`);
}


function handleRoomSubmit(event){
    event.preventDefault();
    const input = form.querySelector("input");
    // 여태까지는 JSON을 String 문자열로 바꿨는데 socket io는 그냥 뒤에 아무거나 상관없음.
    socket.emit(
        "enter_room", 
        input.value,
        backendDone // emit은 항상 마지막에 함수 와야함,
        ); // object로 만들어줌 string 아니여도 괜춘함. 
    input.value = ""
}


form.addEventListener("submit", handleRoomSubmit);
