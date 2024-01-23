import PlusSVG from './assets/plus.svg';
import TrashSVG from './assets/trash-bin.svg';
import CloseXSVG from './assets/close-x.svg';
import {format, isPast} from 'date-fns';

let contentDiv = document.getElementById('content');

const timeFormat = "yyyy-MM-dd";
const today = new Date();

class Task {
    constructor(name, description, date, isDone) {
        this.name = name;
        this.description = description;
        this.date = date;
        this.isDone = isDone;
    }

    getName() {
        return this.name;
    }

    setName(newName) {
        this.name = newName
    }

    getDescription() {
        return this.description;
    }

    setDescription(text) {
        this.description = text;
    }

    getDate() {
        return this.date;
    }

    setDate(date) {
        this.date = date;
    }

    getIsDone() {
        return this.isDone;
    }

    setIsDone(isDone) {
        this.isDone = isDone;
    }
}

export function createTaskFormStructure(project) {
    const dialog = document.createElement('dialog');
    dialog.id = "task-dialog";
    contentDiv.appendChild(dialog);
    
    const taskForm = document.createElement('form');
    taskForm.id = "task-form";
    taskForm.method = "dialog";
    dialog.appendChild(taskForm);

    // Added name input
    const taskName = document.createElement('input');
    taskName.type = "text";
    taskName.placeholder = "Task name";
    taskName.id = "task-name-input";
    taskName.required = true;
    taskForm.appendChild(taskName);
    
    // Added description input
    const taskDescription = document.createElement('input');
    taskDescription.type = "text";
    taskDescription.placeholder = "Description";
    taskDescription.id = "task-description-input";
    taskForm.appendChild(taskDescription);

    // Added date
    const dateBtn = document.createElement('input'); 
    dateBtn.type = 'date';
    dateBtn.id = 'date-btn'
    dateBtn.required = true;
    taskForm.appendChild(dateBtn);

    const btnDiv = document.createElement('div');
    btnDiv.id = "task-div-btn";

    const addBtn = document.createElement('button');
    addBtn.textContent = "Add";
    addBtn.id = "add-task-btn";
    btnDiv.appendChild(addBtn);
    
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = "Cancel";
    cancelBtn.id = "cancel-task-btn";
    btnDiv.appendChild(cancelBtn);

    taskForm.appendChild(btnDiv);

    dialog.show();

    addTask(addBtn, dateBtn, taskName, project, taskDescription);
}

function addTask(addBtn, dateBtn, taskName, project, taskDescription) {
    addBtn.addEventListener('click', () => {
        if (taskName.value !== "" && dateBtn.value !== "") {
            const date = returnDateObject(dateBtn);

            const formattedDate = format(date, timeFormat);
            const formattedToday = format(today, timeFormat);
            
            if (isPast(date) && formattedToday != formattedDate) {
                alert("The day you chose is in the past.");
            } else {
                const task = createTask(project, taskName.value, taskDescription.value, formattedDate);
                showTaskElement(project, task);
                document.querySelectorAll('.checkbox-div').forEach((taskDiv) => {
                        taskDiv.addEventListener('click', () => {
                            createTaskExtensionStructure(task, project);
                    })
                });
            }
        }
    }); 
}

function returnDateObject(dateBtn) {
    let splittedDate = dateBtn.value.split('-').map(n => parseInt(n));
    const date = new Date(splittedDate[0], splittedDate[1] - 1, splittedDate[2]);

    return date;
}

export function createTaskStructure(projectName) {
    const projectNameHead = document.createElement('h3');
    projectNameHead.textContent = projectName;
    contentDiv.appendChild(projectNameHead);

    const addAnchor = document.createElement('div');
    addAnchor.innerHTML += PlusSVG + "Add Task";
    addAnchor.id = "add-anchor-task";
    contentDiv.appendChild(addAnchor);
}

function createTask(project, taskName, taskDescription, taskDate) {
    let task = new Task(taskName, taskDescription, taskDate, false);
    project.setTask(task);
    return task
}

function showTaskElement(project, task) {
    // Checkbox
    const checkboxDiv = document.createElement('div');
    checkboxDiv.classList.add('checkbox-div');
    contentDiv.appendChild(checkboxDiv);

    const label = document.createElement('label');
    label.className = "checkbox-label";
    checkboxDiv.appendChild(label);

    const input = document.createElement('input');
    input.type = "checkbox";
    input.classList.add('checkbox-input');
    input.addEventListener('change', () => {
        task.setIsDone(input.checked);  
    });
    checkboxDiv.appendChild(input);
    
    const p = document.createElement('p');
    p.textContent = project.getLastTask().getName();
    label.appendChild(p);
    checkboxDiv.appendChild(p);

    const trashBinDiv = document.createElement('div');
    trashBinDiv.className = "trash-bin";
    trashBinDiv.role = "button";
    trashBinDiv.innerHTML = TrashSVG;
    trashBinDiv.style.display = 'none';


    checkboxDiv.addEventListener('mouseover', () => {
        trashBinDiv.style.display = 'block';
    });

    checkboxDiv.addEventListener('mouseout', () => {
        trashBinDiv.style.display = 'none';
    });

    trashBinDiv.addEventListener('click', () => {
        checkboxDiv.remove();
        project.removeTask(task);
    });

    label.appendChild(trashBinDiv);
}

function autoResize() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
}

function createExtensionBtns(taskExtensionDialog) {
    const taskExtensionBtnDiv = document.createElement('div');
    taskExtensionBtnDiv.className = "task-ext-btn-div";
    taskExtensionBtnDiv.style.display = "none";
    taskExtensionDialog.appendChild(taskExtensionBtnDiv);

    const taskExtensionAddBtn = document.createElement('button');
    taskExtensionAddBtn.textContent = "Add";
    taskExtensionAddBtn.className = "add-task-ext-btn";
    taskExtensionBtnDiv.appendChild(taskExtensionAddBtn);

    const taskExtensionCancelBtn = document.createElement('button');
    taskExtensionCancelBtn.textContent = "Cancel";
    taskExtensionCancelBtn.className = "cancel-task-ext-btn";
    taskExtensionBtnDiv.appendChild(taskExtensionCancelBtn);


    return taskExtensionBtnDiv;
}

function createTaskExtensionStructure(task, project) {
    const taskExtensionDialog = document.createElement('dialog');
    taskExtensionDialog.id = "task-ext-dialog";
    contentDiv.appendChild(taskExtensionDialog);
    
    const navBarDiv = document.createElement('div');
    navBarDiv.id = "task-ext-navbar";
    taskExtensionDialog.appendChild(navBarDiv);

    const navBarHead = document.createElement('p');
    navBarHead.textContent = project.getName();
    navBarDiv.appendChild(navBarHead);

    const closeXDiv = document.createElement('div')
    closeXDiv.id = "close-x-div";
    closeXDiv.role = "button";
    closeXDiv.innerHTML += CloseXSVG;
    navBarDiv.appendChild(closeXDiv);

    closeXDiv.addEventListener('click', () => {
        taskExtensionDialog.close();
    })

    const taskExtensionName = document.createElement('textarea');
    taskExtensionName.value = task.getName();
    taskExtensionName.id = "task-ext-name";
    taskExtensionDialog.appendChild(taskExtensionName);

    taskExtensionName.addEventListener('input', autoResize, false);
    const taskExtensionNameBtnDiv = createExtensionBtns(taskExtensionDialog);

    taskExtensionName.addEventListener('focusin', () => {
        taskExtensionNameBtnDiv.style.display = "flex";
        document.body.addEventListener('click', (event) => {
            if (event.target.matches('.add-task-ext-btn') || event.target.closest('.add-task-ext-btn')) {
                task.setName(taskExtensionName.value);

                taskExtensionNameBtnDiv.style.display = "none";
            } else if (event.target.matches('.cancel-task-ext-btn') || event.target.closest('.cancel-task-ext-btn')) {
                taskExtensionNameBtnDiv.style.display = "none";
                taskExtensionName.value = task.getName();
            }
        });
    });


    const descriptionTextArea = document.createElement('textarea');
    if (task.getDescription() !== "") {
        descriptionTextArea.value = task.getDescription();
    } else {
        descriptionTextArea.placeholder = "Description";
    }

    descriptionTextArea.id = "task-ext-desc";
    descriptionTextArea.addEventListener('input', autoResize, false);
    taskExtensionDialog.appendChild(descriptionTextArea);

    const taskExtensionDescriptionBtnDiv = createExtensionBtns(taskExtensionDialog);

    descriptionTextArea.addEventListener('focusin', () => {
        taskExtensionDescriptionBtnDiv.style.display = "flex";

        document.body.addEventListener('click', (event) => {
            if (event.target.matches('.add-task-ext-btn') || event.target.closest('.add-task-ext-btn')) {
                task.setDescription(descriptionTextArea.value);
                taskExtensionDescriptionBtnDiv.style.display = "none";
            } else if (event.target.matches('.cancel-task-ext-btn') || event.target.closest('.cancel-task-ext-btn')) {
                taskExtensionDescriptionBtnDiv.style.display = "none";
                descriptionTextArea.value = task.getDescription();
            } 
        });
    });
    
    // Created Date button
    const taskExtensionDateBtn = document.createElement('input'); 
    taskExtensionDateBtn.type = 'date';
    taskExtensionDateBtn.id = 'task-ext-date-btn';
    if (taskExtensionDateBtn.value === "") {
        taskExtensionDateBtn.value = task.getDate();
    }

    taskExtensionDialog.appendChild(taskExtensionDateBtn);

    taskExtensionDateBtn.addEventListener('change', () => {
        const date = returnDateObject(taskExtensionDateBtn);
        const formattedDate = format(date, timeFormat);
        task.setDate(formattedDate);
    });

    taskExtensionDialog.showModal();
}

