const addBtn = document.querySelector('.js-add-btn');
const promptEl = document.querySelector('.prompt');
let todoList =  JSON.parse(localStorage.getItem('todoList')) || [];

renderTodo();

addBtn.addEventListener('click', () => {
  if(addBtn.innerText == 'Add Todo'){
    addTodo();
  }
});

function saveToStorage(){
  localStorage.setItem('todoList', JSON.stringify(todoList));
}

function promptFor(field){
  if(field === 'Todo Name' || field === 'Todo Date'){
    promptEl.innerHTML = ` 
    <h2>All fields are required</h2>
    <p class="warning">Please Enter ${field}</p>
    <button class="ok-btn js-ok-btn">OK</button>
    `
    promptEl.style.display = 'flex';
    const okBtn = document.querySelector('.js-ok-btn');
    
    okBtn.addEventListener('click', () => {
      promptEl.style.display = 'none';
    });
  }
}

function clearinputs(){
  document.querySelector('.js-todo-name').value = '';
  document.querySelector('.js-todo-date').value = '';
}
function addTodo(){
  let todoName = document.querySelector('.js-todo-name').value;
  let todoDate = document.querySelector('.js-todo-date').value;
  if(!todoName){
   promptFor('Todo Name');
  }else if(!todoDate){
    promptFor('Todo Date');
  }else{
    const todoObject = {todoName, todoDate};
    todoList.push(todoObject);
    renderTodo();
  }
  saveToStorage();
  clearinputs();
}
function renderTodo(){
  let todoListHTML = '';
  todoList.forEach((todoObject, index) => {
    const {todoName, todoDate} = todoObject;
    todoListHTML += `
    <div class="todo">
      <p>${index + 1}. ${todoName}</p>
      <p>${todoDate}</p>
      <div class="action">
        <button class="del-btn js-del-btn" data-index-num="${index}">Delete</button>
        <button class="edit-btn js-edit-btn" data-edit-index="${index}">Edit</button>
      </div>
    </div>
    `;
  });
  document.querySelector('.js-todo-list').innerHTML = todoListHTML;
    deleteTodo();
    editTodo();
}
function deleteTodo(){
  document.querySelectorAll('.js-del-btn').forEach((delBtn) => {
    delBtn.addEventListener('click', () => {
      const indexNum = delBtn.dataset.indexNum;
      const todoName = todoList[indexNum].todoName;
      document.querySelector('.prompt').innerHTML = ` 
      <h2>Delete ${todoName.slice(0,12)}...</h2>
      <p class="warning">Are You Sure</p>
      <div class="action-btn">
        <button class="ok-btn js-yes-btn">Yes</button>
        <button class="no-btn js-no-btn">No</button>
      </div>
    `
    document.querySelector('.prompt').style.display = 'flex';
    const yesBtn = document.querySelector('.js-yes-btn');
    const noBtn = document.querySelector('.js-no-btn');
    yesBtn.addEventListener('click', () => {
      todoList.splice(indexNum, 1);
      renderTodo();
      saveToStorage();
      document.querySelector('.prompt').style.display = 'none';
    });
    noBtn.addEventListener('click', () => {
        document.querySelector('.prompt').style.display = 'none';
      });
    });
  });
}
function editTodo(){
  document.querySelectorAll('.js-edit-btn').forEach((editBtn) => {
    let editBefor = false;
    editBtn.addEventListener('click', () => {
      const editIndex = editBtn.dataset.editIndex;
      let editValue = todoList[editIndex].todoName;
      let editDate = todoList[editIndex].todoDate;
      addBtn.innerText = 'Done';
      document.querySelector('.js-todo-date').value = editDate;
      document.querySelector('.js-todo-name').value = editValue;
      addBtn.addEventListener('click', () => {
        newValue = document.querySelector('.js-todo-name').value;
        editDate = document.querySelector('.js-todo-date').value;
        if(addBtn.innerText = 'Done'){
          // update todoList Array
          todoList = todoList.map((todo) => {
            return todo.todoName === editValue ? {todoName: newValue, todoDate: editDate} : todo
          });
          saveToStorage();
          addBtn.innerText = 'Add Todo';
          renderTodo();
          if(!editBefor){
            clearinputs();
            editBefor = true;
          }else {
            document.querySelector('.js-todo-name').value = newValue;
            document.querySelector('.js-todo-date').value = editDate;
          }
        }
      });
    });
  });
}
