const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");


const call = document.getElementById("call")

call.hidden = true;


let myStream;
let muted = false;
let cameraoff = false;
let roomName;
let myPeerConnection;

async function getCameras(){
    try{
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter((device)=> device.kind === "videoinput");
        const currentCamera = myStream.getVideoTracks()[0];
        cameras.forEach((camera)=>{
            const option = document.createElement("option");
            option.value = camera.deviceId;
            option.innerText = camera.label;
            if(currentCamera.label === camera.label){
                option.selected = true;
            }
            camerasSelect.appendChild(option);
        });
    }catch(e){
        console.log();
    }
}


async function getMedia(deviceId){
    console.log(deviceId);
    const initialConstrains ={
        audio: true,
        video: { facingMode: "user"},
    };
    const cameraConstraints ={
        audio: true,
        video: { deviceId: { exact: deviceId } },
    };

    try{
      myStream = await navigator.mediaDevices.getUserMedia(
          deviceId ? initialConstrains : cameraConstraints
      );
      myFace.srcObject = myStream;
      if(!deviceId){
        console.log(myStream);
        await getCameras();
      }
    } catch(e){
        console.log(myStream);
        console.log(e);
    }


}

// getMedia();


function handleMuteClick(){
    myStream
        .getAudioTracks()
        .forEach((track) => (track.enabled = !track.enabled));
    if(!muted){
        muteBtn.innerText = "UnMute";
        muted = true;
    }else{
        muteBtn.innerText = "Mute";
        muted = false;
    }
}

function handleCameraClick(){
        myStream
            .getVideoTracks()
            .forEach((track) => (track.enabled = !track.enabled) );
    if(cameraoff){
        cameraBtn.innerText = "Turn Camera Off";
        cameraoff = false;
    }else{
        cameraBtn.innerText = "Turn Camera On";
        cameraoff = true;
    }
}

async function hanldeCameraChange(){
    if(!muted){
        muteBtn.innerText = "UnMute";
        muted = true;
    }else{
        muteBtn.innerText = "Mute";
        muted = false;
    }
    if(cameraoff){
        cameraBtn.innerText = "Turn Camera Off";
        cameraoff = false;
    }else{
        cameraBtn.innerText = "Turn Camera On";
        cameraoff = true;
    }
    await getMedia(camerasSelect.value);
}

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
camerasSelect.addEventListener("input", hanldeCameraChange);




// Welcome Form (join room)
const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");


async function startMedia(){
    welcome.hidden = true;
    call.hidden = false;
    await getMedia();
    makeConnection();    
}


function handleWelcomeSubmit(event){
    event.preventDefault();
    const input = welcomeForm.querySelector("input");
    socket.emit("join_room", input.value, startMedia);
    roomName = input.value;
    input.value="";
}

welcomeForm.addEventListener("submit", handleWelcomeSubmit);


// socket Code

socket.on("welcome", ()=>{
    console.log("somebody joined");
});


// RTC Code
function makeConnection(){
    mypeerConnection = new RTCPeerConnection();
    console.log(myStream.getTracks());
}







