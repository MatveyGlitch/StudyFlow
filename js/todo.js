document.addEventListener("DOMContentLoaded", () => {
    // ===== ЭЛЕМЕНТЫ СПИСКА =====

    const todoForm = document.getElementById("todo-form");
    const todoInput = document.getElementById("todo-input");
    const todoList = document.getElementById("todo-list");

    const todoCounter = document.getElementById("todo-counter");
    const todoEmpty = document.getElementById("todo-empty");
    const clearButton = document.getElementById("todo-clear");

    // Карточки статистики
    const statTotal = document.getElementById("stat-total");
    const statCompleted = document.getElementById("stat-completed");
    const statPercent = document.getElementById("stat-percent");


    // ===== ХРАНЕНИЕ ДАННЫХ =====

    const storageKey = "studyflow_tasks";

    function loadTasks() {
        try {
            const saved = JSON.parse(localStorage.getItem(storageKey));

            if (!Array.isArray(saved)) {
                return [];
            }

            return saved.filter(task =>
                task &&
                typeof task.id === "string" &&
                typeof task.text === "string" &&
                typeof task.completed === "boolean"
            );
        } catch {
            return [];
        }
    }

    let tasks = loadTasks();

    function saveTasks() {
        localStorage.setItem(storageKey, JSON.stringify(tasks));
    }


    // ===== ОБНОВЛЕНИЕ СТАТИСТИКИ =====

    function updateStatistics() {
        const total = tasks.length;
        const completed = tasks.filter(task => task.completed).length;

        const percent = total === 0
            ? 0
            : Math.round((completed / total) * 100);

        todoCounter.textContent = `Выполнено ${completed} из ${total}`;

        statTotal.textContent = total;
        statCompleted.textContent = completed;
        statPercent.textContent = `${percent}%`;

        // Показываем сообщение, если задач нет
        todoEmpty.hidden = total > 0;

        // Кнопка активна только при наличии выполненных задач
        clearButton.disabled = completed === 0;

        // Передаём данные компоненту прогресс-бара
        window.dispatchEvent(new CustomEvent("studyflow:tasks-updated", {
            detail: {
                total: total,
                completed: completed,
                percent: percent
            }
        }));
    }


    // ===== ОТОБРАЖЕНИЕ ЗАДАЧ =====

    function renderTasks() {
        todoList.innerHTML = "";

        tasks.forEach(task => {
            // Элемент списка
            const item = document.createElement("li");
            item.className = "todo-item";

            if (task.completed) {
                item.classList.add("completed");
            }

            // Чекбокс выполнения
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "todo-checkbox";
            checkbox.checked = task.completed;
            checkbox.setAttribute(
                "aria-label",
                `Выполнена задача: ${task.text}`
            );

            // Название задачи
            const text = document.createElement("span");
            text.className = "todo-text";
            text.textContent = task.text;

            // Кнопка удаления
            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "todo-delete";
            deleteButton.textContent = "×";
            deleteButton.title = "Удалить задачу";
            deleteButton.setAttribute(
                "aria-label",
                `Удалить задачу: ${task.text}`
            );

            // Отметка выполнения
            checkbox.addEventListener("change", () => {
                toggleTask(task.id);
            });

            // Удаление задачи
            deleteButton.addEventListener("click", () => {
                deleteTask(task.id);
            });

            item.append(checkbox, text, deleteButton);
            todoList.appendChild(item);
        });

        updateStatistics();
    }


    // ===== ДОБАВЛЕНИЕ ЗАДАЧИ =====

    function addTask(text) {
        const taskText = text.trim();

        if (taskText === "") {
            return;
        }

        const newTask = {
            id: crypto.randomUUID(),
            text: taskText,
            completed: false
        };

        tasks.push(newTask);

        saveTasks();
        renderTasks();

        todoInput.value = "";
        todoInput.focus();
    }


    // ===== ВЫПОЛНЕНИЕ ЗАДАЧИ =====

    function toggleTask(id) {
        const task = tasks.find(task => task.id === id);

        if (!task) {
            return;
        }

        task.completed = !task.completed;

        saveTasks();
        renderTasks();
    }


    // ===== УДАЛЕНИЕ ЗАДАЧИ =====

    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);

        saveTasks();
        renderTasks();
    }


    // ===== УДАЛЕНИЕ ВЫПОЛНЕННЫХ =====

    function clearCompletedTasks() {
        tasks = tasks.filter(task => !task.completed);

        saveTasks();
        renderTasks();
    }


    // ===== ОБРАБОТЧИКИ СОБЫТИЙ =====

    todoForm.addEventListener("submit", event => {
        event.preventDefault();
        addTask(todoInput.value);
    });

    clearButton.addEventListener("click", clearCompletedTasks);


    // ===== НАЧАЛЬНАЯ ЗАГРУЗКА =====

    renderTasks();
});