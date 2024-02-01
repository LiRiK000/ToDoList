const element = document.getElementById('new-task');
const button = document.getElementById('btn');
const list = document.getElementById('todo-list');
const title = document.getElementById('title');
const filterSelect = document.getElementById('filter');

const counters = {
    total: 0,
    done: 0,
    undone: 0,
};

let filter = 'all';
let tasks = loadFromLocalStorage();

if (!Array.isArray(tasks)) {
    tasks = [];
}
updateAndRender(tasks);

function saveToLocalStorage(tasks) {
    localStorage.setItem('todoList', JSON.stringify(tasks));
}

function loadFromLocalStorage() {
    const savedTasks = localStorage.getItem('todoList');
    return savedTasks ? JSON.parse(savedTasks) : [];
}

function createTaskElement(title, isDone) {
    const taskContainer = document.createElement('div');
    taskContainer.className = 'task-container';

    const listItem = document.createElement('li');
    listItem.className = 'task';

    const spanClass = isDone ? 'done' : '';
    const span = document.createElement('span');
    span.className = spanClass;
    span.textContent = title;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Удалить';
    deleteButton.addEventListener('click', () => {
        const taskContainer = deleteButton.closest('.task-container');
        const index = Array.from(list.children).indexOf(taskContainer);
        removeTask(index);
    });

    listItem.appendChild(span);
    listItem.appendChild(deleteButton);

    listItem.addEventListener('click', () => {
        span.classList.toggle('done');
        updateCounters();
    });

    taskContainer.appendChild(listItem);
    return taskContainer;
}

function renderTasks(taskList) {
    list.innerHTML = '';
    taskList.forEach(task => {
        counters.total++;
        task.isDone ? counters.done++ : counters.undone++;
        const taskElement = createTaskElement(task.title, task.isDone);
        list.appendChild(taskElement);
    });
}

function updateAndRender(taskList) {
    list.innerHTML = '';
    counters.total = 0;
    counters.done = 0;
    counters.undone = 0;
    renderTasks(taskList);
    updateCounters();
}

function updateCounters() {
    let selectedCounter;

    if (filter === 'all') {
        selectedCounter = counters.total;
    } else if (filter === 'done') {
        selectedCounter = counters.done;
    } else if (filter === 'undone') {
        selectedCounter = counters.undone;
    }

    title.textContent = 'Задачи ' + selectedCounter;
}

function addTask(title, isDone) {
    const newTask = { title, isDone };
    tasks.push(newTask);
    saveToLocalStorage(tasks);
    updateAndRender(tasks);
    element.value = ''; // Очищаем поле ввода
}

function toggleTask(index) {
    const task = tasks[index];
    if (task && 'isDone' in task) {
        task.isDone = !task.isDone;
        saveToLocalStorage(tasks);
        updateAndRender(tasks);
    }
}

function removeTask(index) {
    tasks.splice(index, 1);
    updateCounters();
    saveToLocalStorage(tasks);
    updateAndRender(tasks);
}

function applyFilter() {
    const taskContainers = document.querySelectorAll('.task-container');

    taskContainers.forEach(taskContainer => {
        const isDone = taskContainer.querySelector('span').classList.contains('done');
        if (filter === 'all' || (filter === 'done' && isDone) || (filter === 'undone' && !isDone)) {
            taskContainer.style.display = 'block';
        } else {
            taskContainer.style.display = 'none';
        }
    });
}

button.addEventListener('click', () => {
    if (!element.value.trim() || element.value.length > 35) {
        alert('Введите название задачи');
        element.value = '';
        return;
    }
    addTask(element.value, false);
});

filterSelect.addEventListener('change', () => {
    filter = filterSelect.value;
    updateCounters();
    applyFilter();
});

element.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        if (!element.value.trim() || element.value.length > 35) {
            alert('Введите название задачи');
            element.value = '';
            return;
        }
        addTask(element.value, false);
    }
});

list.addEventListener('click', event => {
    const targetTask = event.target.closest('.task-container');
    if (targetTask) {
        const index = Array.from(list.children).indexOf(targetTask);
        toggleTask(index);
    }
});
