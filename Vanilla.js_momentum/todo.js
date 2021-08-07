const toDoForm = document.querySelector(".js-toDoform"),
    toDoInput = toDoForm.querySelector("input"),
    toDoList = document.querySelector(".js-toDoList");


const TODOS_LS = 'toDos';

let toDos = [];


function filterFn(toDo){
    return toDo.id === 1
}



function deleteTodo(event){
    const btn = event.target
    const li = btn.parentNode
    toDoList.removeChild(li);
    const cleanToDos = toDos.filter(function(toDo){ //filter 함수
        return toDo.id !== parseInt(li.id); // parseInt string->number
    });
    toDos = cleanToDos
    saveToDos();
}


function saveToDos(){
    localStorage.setItem(TODOS_LS, JSON.stringify(toDos)); // 여기서 toDos가 object로 표시되는데, localstorage에서는 string만 표시
    // object -> string => JSON.stringify
}




function paintToDo(text){
    const li = document.createElement("li");
    const delBtn = document.createElement("button");
    const span = document.createElement("span");
    const newId = toDos.length + 1;
    delBtn.innerHTML = "❌";
    delBtn.addEventListener("click", deleteTodo);
    span.innerText = text
    li.appendChild(span);
    li.appendChild(delBtn);
    li.id = newId
    toDoList.appendChild(li);
    const toDoObj = {
        text: text,
        id: newId
    };
    toDos.push(toDoObj);
    saveToDos();
}

function handleSubmit(event){
    event.preventDefault();
    const currentValue = toDoInput.value;
    paintToDo(currentValue);
    toDoInput.value = "";    
}


function LoadToDos(){
    const loadedToDos = localStorage.getItem(TODOS_LS);
    if(loadedToDos !== null){
        const paresedToDos = JSON.parse(loadedToDos);
        paresedToDos.forEach(function(toDo){ // forEach 함수 
            paintToDo(toDo.text);
        });
    }
}


function init(){
    LoadToDos();
    toDoForm.addEventListener("submit", handleSubmit)
}

init();