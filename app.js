const Element = document.getElementById('new-task');
const Button = document.getElementById('btn');
const list = document.getElementById('todo-list');
const title = document.getElementById('title');
const filterSelect = document.getElementById('filter');

let counter = 0;
let doneCounter = 0;
let undoneCounter = 0;
let filter = 'all';
let array = loadFromLocalStorage();

if (!Array.isArray(array)) {
    array = [];
}
updateAndRender(array);

// ! Функции для работы с локальным хранилищем:

function saveToLocalStorage(array) {
    localStorage.setItem('todoList', JSON.stringify(array));
}

function loadFromLocalStorage() {
    const savedList = localStorage.getItem('todoList');
    return savedList ? JSON.parse(savedList) : [];
}

// ! Функции отрисовки и обновления:

function renderTask(title, isDone) {
    var taskContainer = document.createElement("div");
    taskContainer.className = "task-container";
    var listItem = document.createElement("li");
    listItem.className = "task";

    const spanClass = isDone ? 'done' : '';

    listItem.innerHTML = `
        <span class="${spanClass}">${title}</span>
        <button onclick="removeTask(this)">Удалить</button>
    `;

    listItem.addEventListener('click', () => {
        const span = listItem.querySelector('span');
        span.classList.toggle('done');
        updateCounters();
    });

    taskContainer.appendChild(listItem);
    list.appendChild(taskContainer);
    Element.value = '';
}

function render(array) {
    if (array.length === 0) {
        return;
    } else {
        array.forEach(task => {
            counter++;
            if (task.isDone) {
                doneCounter++;
            } else {
                undoneCounter++;
            }
            renderTask(task.title, task.isDone);
        });
    }
}

function updateAndRender(array) {
    list.innerHTML = '';
    counter = 0;
    doneCounter = 0;
    undoneCounter = 0;
    render(array);
    updateCounters();
}

function updateCounters() {
    let selectedCounter;

    if (filter === 'all') {
        selectedCounter = counter;
    } else if (filter === 'done') {
        selectedCounter = doneCounter;
    } else if (filter === 'undone') {
        selectedCounter = undoneCounter;
    }

    title.textContent = 'Задачи ' + selectedCounter;
}


// ! Функции для управления задачами:

function addTask(title, isDone) {
    const newTask = { title, isDone };
    array.push(newTask);
    saveToLocalStorage(array);
    updateAndRender(array);
}

function toggleTask(index) {
    const task = array[index];
    if (task && 'isDone' in task) {
        task.isDone = !task.isDone;
        saveToLocalStorage(array);
        updateAndRender(array);
    }
}

function removeTask(index) {
    array.splice(index, 1);
    updateCounters();
    saveToLocalStorage(array);
    updateAndRender(array);
}

// ! Функции для фильтрации:

function applyFilter() {
    const tasks = document.querySelectorAll('.task-container');

    tasks.forEach(taskContainer => {
        const isDone = taskContainer.querySelector('span').classList.contains('done');
        if (filter === 'all' || (filter === 'done' && isDone) || (filter === 'undone' && !isDone)) {
            taskContainer.style.display = 'block';
        } else {
            taskContainer.style.display = 'none';
        }
    });
}

// !! Обработчики событий:

Button.addEventListener('click', () => {
    if (!Element.value.trim() || Element.value.length > 35) {
        alert('Введите название заметки');
        Element.value = ''
        return;
    }
    addTask(Element.value, false);
});

filterSelect.addEventListener('change', () => {
    filter = filterSelect.value;
    updateCounters();
    applyFilter();
});

list.addEventListener('click', (event) => {
    const targetTask = event.target.closest('.task-container');
    if (targetTask) {
        const index = Array.from(list.children).indexOf(targetTask);
        toggleTask(index);
    }
});
