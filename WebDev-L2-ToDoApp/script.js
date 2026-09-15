/* =========================
   VARIABLES
========================= */

let tasks = [];

let editingTaskId = null;


/* =========================
   GET HTML ELEMENTS
========================= */

const taskForm =
    document.getElementById("taskForm");

const taskInput =
    document.getElementById("taskInput");

const pendingList =
    document.getElementById("pendingList");

const completedList =
    document.getElementById("completedList");

const pendingCount =
    document.getElementById("pendingCount");

const completedCount =
    document.getElementById("completedCount");

const pendingEmpty =
    document.getElementById("pendingEmpty");

const completedEmpty =
    document.getElementById("completedEmpty");

const inputError =
    document.getElementById("inputError");

const currentDate =
    document.getElementById("currentDate");


/* =========================
   LOAD TASKS FROM LOCAL STORAGE
========================= */

function loadTasks() {

    const savedTasks =
        localStorage.getItem("shreyaTodoTasks");


    if (savedTasks) {

        try {

            tasks = JSON.parse(savedTasks);

        } catch (error) {

            tasks = [];

        }

    }

}


/* =========================
   SAVE TASKS
========================= */

function saveTasks() {

    localStorage.setItem(
        "shreyaTodoTasks",
        JSON.stringify(tasks)
    );

}


/* =========================
   GENERATE ID
========================= */

function generateId() {

    return Date.now() +
        Math.random()
            .toString(16)
            .slice(2);

}


/* =========================
   ADD TASK
========================= */

taskForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const taskText =
            taskInput.value.trim();


        if (taskText === "") {

            showInputError(
                "Please enter a task."
            );

            return;

        }


        hideInputError();


        const newTask = {

            id: generateId(),

            text: taskText,

            completed: false,

            createdAt:
                new Date().toISOString(),

            completedAt: null

        };


        tasks.push(newTask);


        saveTasks();

        renderTasks();


        taskInput.value = "";

        taskInput.focus();

    }
);


/* =========================
   RENDER TASKS
========================= */

function renderTasks() {

    pendingList.innerHTML = "";

    completedList.innerHTML = "";


    const pendingTasks =
        tasks.filter(
            task => !task.completed
        );


    const completedTasks =
        tasks.filter(
            task => task.completed
        );


    /* COUNTS */

    pendingCount.textContent =
        `${pendingTasks.length} pending`;


    completedCount.textContent =
        `${completedTasks.length} completed`;


    /* EMPTY STATES */

    pendingEmpty.style.display =
        pendingTasks.length === 0
            ? "block"
            : "none";


    completedEmpty.style.display =
        completedTasks.length === 0
            ? "block"
            : "none";


    /* CREATE PENDING CARDS */

    pendingTasks.forEach(
        function(task) {

            pendingList.appendChild(
                createTaskCard(task)
            );

        }
    );


    /* CREATE COMPLETED CARDS */

    completedTasks.forEach(
        function(task) {

            completedList.appendChild(
                createTaskCard(task)
            );

        }
    );

}


/* =========================
   CREATE TASK CARD
========================= */

function createTaskCard(task) {

    const card =
        document.createElement("article");


    card.className =
        "task-card";


    if (task.completed) {

        card.classList.add(
            "completed-task"
        );

    }


    const top =
        document.createElement("div");

    top.className =
        "task-top";


    /* COMPLETE BUTTON */

    const completeButton =
        document.createElement("button");

    completeButton.className =
        "complete-btn";

    completeButton.type =
        "button";

    completeButton.title =
        task.completed
            ? "Mark as pending"
            : "Mark as complete";


    completeButton.textContent =
        task.completed ? "✓" : "";


    completeButton.addEventListener(
        "click",
        function() {

            toggleComplete(task.id);

        }
    );


    /* TASK CONTENT */

    const content =
        document.createElement("div");

    content.className =
        "task-content";


    const text =
        document.createElement("p");

    text.className =
        "task-text";

    text.textContent =
        task.text;


    const time =
        document.createElement("p");

    time.className =
        "task-time";


    let timeText =
        `Added ${formatDate(task.createdAt)}`;


    if (
        task.completed &&
        task.completedAt
    ) {

        timeText +=
            ` • Completed ${formatDate(task.completedAt)}`;

    }


    time.textContent =
        timeText;


    content.appendChild(text);

    content.appendChild(time);


    top.appendChild(completeButton);

    top.appendChild(content);


    /* ACTIONS */

    const actions =
        document.createElement("div");

    actions.className =
        "task-actions";


    /* EDIT BUTTON */

    const editButton =
        document.createElement("button");

    editButton.type =
        "button";

    editButton.className =
        "action-btn edit-btn";

    editButton.textContent =
        "Edit";


    editButton.addEventListener(
        "click",
        function() {

            startEditing(
                task.id,
                content
            );

        }
    );


    /* DELETE BUTTON */

    const deleteButton =
        document.createElement("button");

    deleteButton.type =
        "button";

    deleteButton.className =
        "action-btn delete-btn";

    deleteButton.textContent =
        "Delete";


    deleteButton.addEventListener(
        "click",
        function() {

            deleteTask(task.id);

        }
    );


    actions.appendChild(editButton);

    actions.appendChild(deleteButton);


    card.appendChild(top);

    card.appendChild(actions);


    return card;

}


/* =========================
   MARK COMPLETE
========================= */

function toggleComplete(taskId) {

    const task =
        tasks.find(
            item => item.id === taskId
        );


    if (!task) {

        return;

    }


    task.completed =
        !task.completed;


    if (task.completed) {

        task.completedAt =
            new Date().toISOString();

    } else {

        task.completedAt = null;

    }


    saveTasks();

    renderTasks();

}


/* =========================
   DELETE TASK
========================= */

function deleteTask(taskId) {

    const shouldDelete =
        confirm(
            "Are you sure you want to delete this task?"
        );


    if (!shouldDelete) {

        return;

    }


    tasks =
        tasks.filter(
            task => task.id !== taskId
        );


    saveTasks();

    renderTasks();

}


/* =========================
   EDIT TASK
========================= */

function startEditing(
    taskId,
    contentElement
) {

    if (editingTaskId !== null) {

        renderTasks();

    }


    const task =
        tasks.find(
            item => item.id === taskId
        );


    if (!task) {

        return;

    }


    editingTaskId =
        taskId;


    contentElement.innerHTML = "";


    const input =
        document.createElement("input");

    input.type =
        "text";

    input.className =
        "edit-input";

    input.value =
        task.text;

    input.maxLength =
        150;


    contentElement.appendChild(
        input
    );


    const actions =
        contentElement.parentElement
            .parentElement
            .querySelector(
                ".task-actions"
            );


    actions.innerHTML = "";


    /* SAVE */

    const saveButton =
        document.createElement("button");

    saveButton.type =
        "button";

    saveButton.className =
        "action-btn save-btn";

    saveButton.textContent =
        "Save";


    saveButton.addEventListener(
        "click",
        function() {

            saveEdit(
                taskId,
                input.value
            );

        }
    );


    /* CANCEL */

    const cancelButton =
        document.createElement("button");

    cancelButton.type =
        "button";

    cancelButton.className =
        "action-btn cancel-btn";

    cancelButton.textContent =
        "Cancel";


    cancelButton.addEventListener(
        "click",
        function() {

            editingTaskId = null;

            renderTasks();

        }
    );


    actions.appendChild(saveButton);

    actions.appendChild(cancelButton);


    input.focus();

    input.select();


    /* ENTER TO SAVE */

    input.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Enter"
            ) {

                saveEdit(
                    taskId,
                    input.value
                );

            }


            if (
                event.key === "Escape"
            ) {

                editingTaskId = null;

                renderTasks();

            }

        }
    );

}


/* =========================
   SAVE EDIT
========================= */

function saveEdit(
    taskId,
    newText
) {

    const cleanText =
        newText.trim();


    if (cleanText === "") {

        alert(
            "Task cannot be empty."
        );

        return;

    }


    const task =
        tasks.find(
            item => item.id === taskId
        );


    if (!task) {

        return;

    }


    task.text =
        cleanText;


    editingTaskId =
        null;


    saveTasks();

    renderTasks();

}


/* =========================
   FORMAT DATE
========================= */

function formatDate(
    dateString
) {

    const date =
        new Date(dateString);


    return date.toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


/* =========================
   INPUT ERROR
========================= */

function showInputError(
    message
) {

    inputError.textContent =
        message;

    inputError.style.display =
        "block";

}


function hideInputError() {

    inputError.textContent =
        "";

    inputError.style.display =
        "none";

}


/* =========================
   CURRENT DATE
========================= */

function displayCurrentDate() {

    const today =
        new Date();


    currentDate.textContent =
        today.toLocaleDateString(
            "en-IN",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

}


/* =========================
   INITIALIZE APP
========================= */

loadTasks();

displayCurrentDate();

renderTasks();