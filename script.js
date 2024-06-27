document.getElementById('add-task-btn').addEventListener('click', () => {
    $('#taskModal').modal('show');
    document.getElementById('task-form').reset();
    document.getElementById('task-form').onsubmit = function (e) {
        e.preventDefault();
        addTask();
    };
});

function loadTasks() {
    fetch('http://localhost:3000/api/tasks')
    .then(response => response.json())
    .then(data => {
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';
        data.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.className = 'task-item card mt-3';
            taskItem.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${task.title}</h5>
                    <p class="card-text">${task.description}</p>
                    <p class="card-text"><small class="text-muted">Due: ${task.dueDate}</small></p>
                    <button class="btn btn-warning btn-edit" onclick="editTask(${task.id})">Edit</button>
                    <button class="btn btn-danger btn-delete" onclick="deleteTask(${task.id})">Delete</button>
                </div>
            `;
            taskList.appendChild(taskItem);
        });
    })
    .catch(error => {
        console.error('Error:', error);
        displayErrorMessage('Failed to load tasks.');
    });
}

function addTask() {
    const taskData = {
        title: document.getElementById('task-title').value,
        description: document.getElementById('task-description').value,
        dueDate: document.getElementById('task-due-date').value,
    };
    fetch('http://localhost:3000/api/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
    })
    .then(response => response.json())
    .then(data => {
        $('#taskModal').modal('hide');
        loadTasks();
    })
    .catch(error => {
        console.error('Error:', error);
        displayErrorMessage('Failed to add task.');
    });
}

function editTask(id) {
    fetch(`http://localhost:3000/api/tasks/${id}`)
    .then(response => response.json())
    .then(task => {
        document.getElementById('task-title').value = task.title;
        document.getElementById('task-description').value = task.description;
        document.getElementById('task-due-date').value = task.dueDate;
        $('#taskModal').modal('show');
        document.getElementById('task-form').onsubmit = function (e) {
            e.preventDefault();
            updateTask(id);
        };
    })
    .catch(error => {
        console.error('Error:', error);
        displayErrorMessage('Failed to load task for editing.');
    });
}

function updateTask(id) {
    const taskData = {
        title: document.getElementById('task-title').value,
        description: document.getElementById('task-description').value,
        dueDate: document.getElementById('task-due-date').value,
    };
    fetch(`http://localhost:3000/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
    })
    .then(response => response.json())
    .then(data => {
        $('#taskModal').modal('hide');
        loadTasks();
    })
    .catch(error => {
        console.error('Error:', error);
        displayErrorMessage('Failed to update task.');
    });
}

function deleteTask(id) {
    fetch(`http://localhost:3000/api/tasks/${id}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.status === 204) {
            loadTasks();
        } else {
            throw new Error('Failed to delete task.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        displayErrorMessage('Failed to delete task.');
    });
}

function displayErrorMessage(message) {
    const taskList = document.getElementById('task-list');
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message alert alert-danger mt-3';
    errorMessage.textContent = message;
    taskList.appendChild(errorMessage);
}

loadTasks();
