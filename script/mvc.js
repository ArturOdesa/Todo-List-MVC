class TaskModel {
    constructor() {
        this.tasks = [];
    }

    addTask(task) {
        this.tasks.push({text: task,  isCompleted: false, isImportant: false});

        this.onTaskListChanged(this.tasks);
    }

    deleteTask(index) {
        this.tasks.splice(index, 1);

        this.onTaskListChanged(this.tasks);
    }

    editTaskText(index, task) {
        this.tasks[index].text = task;

        this.onTaskListChanged(this.tasks);
    }

    removeTasks () {
        this.tasks = [];

        this.onTaskListChanged(this.tasks);
    }

    toggleTaskCompleteStatus(index) {
        this.tasks[index].isCompleted = !this.tasks[index].isCompleted;

        this.onTaskListChanged(this.tasks);
    }

    toggleTaskImportantStatus (index) {
        this.tasks[index].isImportant = !this.tasks[index].isImportant;

        this.onTaskListChanged(this.tasks);
    }

    showAllTask () {
        this.onTaskListChanged(this.tasks);
    }

    showCompletedTasks () {
        this.completedTasks = this.tasks.filter((task) => task.isCompleted === true);

        if (this.completedTasks.length !== 0) {
            this.onTaskListChanged(this.completedTasks);
        }
        else {
            this.onTaskListChanged(this.tasks);
        }
    }

    showUncompletedTasks () {
        this.uncompletedTasks = this.tasks.filter((task) => task.isCompleted === false);

        if (this.uncompletedTasks.length !== 0) {
            this.onTaskListChanged(this.uncompletedTasks);
        }
        else {
            this.onTaskListChanged(this.tasks);
        }
    }

    showImportantTasks () {
        this.importantTasks = this.tasks.filter((task) => task.isImportant === true);

        if (this.importantTasks.length !== 0) {
            this.onTaskListChanged(this.importantTasks);
        }
        else {
            this.onTaskListChanged(this.tasks);
        }
    }

    bindTaskListChanged (callback) {
        this.onTaskListChanged = callback;
    }
}

class TaskView {
    constructor() {
        this.taskList = this.getElement('#task-list');
        this.taskInput = this.getElement('#task-text');
        this.addTaskBtn = this.getElement('#add-task-btn');
        this.startMessage = this.getElement('#start-message');
        this.taskTemplateContent = this.getElement('#task-template');
        this.footer = this.getElement('#footer');
        this.completedTasksBtn = this.getElement('#completed');
        this.uncompletedTasksBtn = this.getElement('#uncompleted');
        this.importantTasksBtn = this.getElement('#important')
        this.removeAll = this.getElement('#remove-all');
        this.showAll = this.getElement('#show-all');
    }

    getElement(selector) {
        return document.querySelector(selector);
    }

    get _taskText() {
        return this.taskInput.value;
    }

    _resetInput () {
        this.taskInput.value = '';
    }

    displayTasks(tasks) {
        while (this.taskList.firstChild) {
            this.taskList.removeChild(this.taskList.firstChild);
        }

        this.startMessage.hidden = tasks.length !== 0;
        this.footer.hidden = tasks.length === 0;

        tasks.forEach((task, index) => {
            const taskTemplateClone = this.taskTemplateContent.content.cloneNode(true);
            const taskItem = taskTemplateClone.querySelector('#task-item');
            const taskName = taskItem.querySelector('#task-name');
            taskName.textContent = task.text;
            const checkboxHolder = taskItem.querySelector('#checkbox-holder');
            const taskCompletedCheckbox = taskItem.querySelector('#task-done');
            const taskImportantCheckbox = taskItem.querySelector('#task-important');
            const editTaskBtn = taskItem.querySelector('#edit-btn');
            const deleteTaskBtn = taskItem.querySelector('#delete-btn');

            if (this.editingIndex === index) {
                const editInput = document.createElement('input');
                editInput.classList.add('edit-task-input')
                editInput.value = task.text;

                editInput.addEventListener('keyup', (e) => {
                    if (e.key === 'Escape') {
                        this.displayTasks(tasks);
                    }
                    else if (e.key === 'Enter') {
                        this.onEditTaskText(index, editInput.value);
                    }
                });

                taskName.hidden = true;
                checkboxHolder.after(editInput);
                editInput.focus();
            }
            else {
                taskName.textContent = task.text;
            }

            editTaskBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.editingIndex = index;
                this.displayTasks(tasks);
            })

            if (task.isCompleted) {
                taskItem.classList.add('completed');
                taskName.classList.add('completed-text');
                taskImportantCheckbox.disabled = true;
                taskCompletedCheckbox.checked = true;
                editTaskBtn.hidden = true;
            }

            if (task.isImportant) {
                taskItem.classList.add('important');
                taskImportantCheckbox.checked = true;
            }

            taskCompletedCheckbox.addEventListener('click', () => {
                this.onToggleCompletedStatus(index);
            });

            taskImportantCheckbox.addEventListener('click', () => {
                this.onToggleImprotantStatus(index)
            });

            deleteTaskBtn.addEventListener('click', () => {
                this.onDeleteTask(index);
            })

            this.taskList.append(taskItem);
        });

        this.editingIndex = null;
    }

    bindAddTask(handler) {
        this.addTaskBtn.addEventListener('click', () => {
            if (this._taskText) {
                handler(this._taskText);
                this._resetInput();
            }
        });

        document.body.addEventListener('keydown', (e) => {
            if (this._taskText && e.key === 'Enter') {
                handler(this._taskText);
                this._resetInput();
            }
        });
    }

    bindShowCompletedTasks(handler) {
        this.completedTasksBtn.addEventListener('click', () => {
            handler(this.bindShowCompletedTasks);
        })
    }

    bindShowUncompletedTasks (handler) {
        this.uncompletedTasksBtn.addEventListener('click', () => {
            handler(this.bindShowUncompletedTasks);
        })
    }

    bindShowImportantTasks (handler) {
        this.importantTasksBtn.addEventListener('click', () => {
            handler(this.bindShowImportantTasks);
        })
    }

    bindShowAllTasks (handler) {
        this.showAll.addEventListener('click', () => {
            handler(this.bindShowAllTasks);
        })
    }

    bindRemoveAllTasks(handler) {
        this.removeAll.addEventListener('click', () => {
            handler(this.bindRemoveAllTasks);
        })
    }

    bindToggleCompletedStatus(handler) {
        this.onToggleCompletedStatus = handler;
    }

    bindToggleImportantStatus(handler) {
        this.onToggleImprotantStatus = handler;
    }

    bindDeleteTask(handler) {
        this.onDeleteTask = handler;
    }

    bindEditTaskText(handler) {
        this.onEditTaskText = handler;
    }

}

class TaskController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.model.bindTaskListChanged(this.onTaskListChanged);
        this.view.bindDeleteTask(this.handleDeleteTask)
        this.view.bindAddTask(this.handleAddTask);
        this.view.bindEditTaskText(this.handleEditTaskText);
        this.view.bindToggleCompletedStatus(this.handleToggleCompletedStatus);
        this.view.bindToggleImportantStatus(this.handleToggleImportantStatus);
        this.view.bindShowAllTasks(this.handleShowAllTasks)
        this.view.bindRemoveAllTasks(this.handleRemoveTasks);
        this.view.bindShowCompletedTasks(this.handleShowCompletedTasks);
        this.view.bindShowUncompletedTasks(this.handleShowUncompletedTasks);
        this.view.bindShowImportantTasks(this.handleShowImportantTasks);
        this.onTaskListChanged(this.model.tasks);
    }

    onTaskListChanged = (tasks) => {
        this.view.displayTasks(tasks)
    }

    handleAddTask = (taskText) => {
        this.model.addTask(taskText);
    }

    handleShowCompletedTasks = () => {
        this.model.showCompletedTasks();
    }

    handleShowUncompletedTasks = () => {
        this.model.showUncompletedTasks();
    }

    handleShowImportantTasks = () => {
        this.model.showImportantTasks();
    }

    handleRemoveTasks = () => {
        this.model.removeTasks();
    }

    handleShowAllTasks = () => {
        this.model.showAllTask();
    }

    handleToggleCompletedStatus = (index) => {
        this.model.toggleTaskCompleteStatus(index);
    }

    handleToggleImportantStatus = (index) => {
        this.model.toggleTaskImportantStatus(index);
    }

    handleDeleteTask = (index) => {
        this.model.deleteTask(index);
    }

    handleEditTaskText = (index, newText) => {
        this.model.editTaskText(index,  newText);
}
}

const todoList = new TaskController(new TaskModel(), new TaskView());
