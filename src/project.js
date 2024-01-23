import HashSVG from './assets/hash.svg';
import {createTaskFormStructure, createTaskStructure} from './task.js';
import PlusSVG from './assets/plus.svg';
import TrashSVG from './assets/trash-bin.svg';

let contentDiv = document.getElementById('content');
let projects = [];

class Project {
    constructor(name) {
        this.name = name;
        this.tasks = [];
    }

    setName(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    setTask(task) {
        this.tasks.push(task);
    }

    getTasks() {
        return this.tasks;
    }

    getLastTask() {
        return this.tasks[this.tasks.length - 1];
    }

    removeTask(taskToRemove) {
        this.tasks = this.tasks.filter(task => task.getName() != taskToRemove.getName());
    }
}

function createProjectPage() {
    // The head of Project
    const myProjectHead = document.createElement('h3');
    myProjectHead.textContent = "My Projects";
    myProjectHead.id = "project-head"
    contentDiv.appendChild(myProjectHead);

    // Add button
    const addAnchor = document.createElement('div');
    addAnchor.innerHTML += PlusSVG + "Add Project";
    addAnchor.id = "add-anchor";
    contentDiv.appendChild(addAnchor);

    const activeProjectsHead = document.createElement('h4');
    activeProjectsHead.textContent = projects.length + " projects";
    contentDiv.appendChild(activeProjectsHead); 


    createProjectDialogStructure();
}

function createProjectDialogStructure() {
    document.querySelector('#add-anchor').addEventListener('click', () => {
        // Dialog
        const dialog = document.createElement('dialog');
        dialog.id = "project-dialog";
        contentDiv.appendChild(dialog);

        const head = document.createElement('h2');
        head.textContent = "Add Project";
        head.id = "dialog-head";
        dialog.appendChild(head);

        // Form for creating a project
        const form = document.createElement('form');
        form.id = "create-project-form";
        form.method = "dialog";
        dialog.appendChild(form);

        const label = document.createElement('label');
        label.textContent = "Name";
        label.id = "name-dialog-label";
        label.htmlFor = "name-input";
        form.appendChild(label);
        
        const nameInput = document.createElement('input');
        nameInput.type = "text";
        nameInput.id = "name-input";
        form.appendChild(nameInput);

        const btnDiv = document.createElement('div');
        btnDiv.id = "div-btn";
        const addBtn = document.createElement('button');
        addBtn.textContent = "Add";
        addBtn.id = "add-btn";
        btnDiv.appendChild(addBtn);

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = "Cancel";
        cancelBtn.id = "cancel-btn";
        btnDiv.appendChild(cancelBtn);

        form.appendChild(btnDiv);
        dialog.showModal();

        addProject(addBtn, nameInput, dialog);

    });
}

function addProject(addBtn, nameInput, dialog) {
    addBtn.addEventListener('click', () => {
        let currentProject;
        if (nameInput.value !== "") {
            currentProject = createProject(nameInput.value);
            dialog.close();
        }

        const activeProjectsHead = document.querySelector('h4');
        activeProjectsHead.textContent = projects.length + " projects";
        
        createProjectListing()
        
    });
}

function createProjectListing() {
    // Project listing under the button
    const projectsDiv = document.createElement('div');
    projectsDiv.className = "projects-div";

    let div = document.createElement('div');
    div.classList.add("hash-svg-div");
    div.innerHTML += HashSVG;
    div.innerHTML += projects[projects.length - 1].getName();
    projectsDiv.appendChild(div);

    const trashBinDiv = document.createElement('div');
    trashBinDiv.className = "project-trash-bin";
    trashBinDiv.role = "button";
    trashBinDiv.innerHTML = TrashSVG;
    trashBinDiv.style.display = 'none';
    projectsDiv.appendChild(trashBinDiv);
    contentDiv.appendChild(projectsDiv)
    
    projectsDiv.addEventListener('mouseover', () => {
        trashBinDiv.style.display = 'block';
    });

    projectsDiv.addEventListener('mouseout', () => {
        trashBinDiv.style.display = 'none';
    });

    div.addEventListener('click', (event) => {
        contentDiv.textContent = "";
        let project = isEqualProject(event.target.textContent);
        if (project) {
            createTaskStructure(project.getName());
            document.getElementById("add-anchor-task").addEventListener('click', () => {
                createTaskFormStructure(project);
            });
        }
    });

    trashBinDiv.addEventListener('click', () => {
        projectsDiv.remove();
        projects = projects.filter(project => project.getName() != currentProject.getName())
        activeProjectsHead.textContent = projects.length + " projects";
    });
            
}

function createProject(name) {
    let project = new Project(name);
    let project_ser = JSON.stringify(project);
    localStorage.setItem(project.getName(), project_ser)
    projects.push(project);
    return project;
}

function isEqualProject(content) {
    return projects.find(project => content === project.getName());
}

export default createProjectPage;