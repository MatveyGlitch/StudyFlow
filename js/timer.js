document.addEventListener("DOMContentLoaded", () => {
    // ===== ЭЛЕМЕНТЫ ТАЙМЕРА =====

    const durationSelect = document.getElementById("timer-duration");
    const timerDisplay = document.getElementById("timer-display");
    const timerStatus = document.getElementById("timer-status");

    const startButton = document.getElementById("timer-start");
    const pauseButton = document.getElementById("timer-pause");
    const resetButton = document.getElementById("timer-reset");

    const focusStat = document.getElementById("stat-focus");

    // ===== ПЕРЕМЕННЫЕ =====

    const storageKey = "studyflow_focus_seconds";

    let remainingSeconds = Number(durationSelect.value) * 60;
    let intervalId = null;
    let endTime = 0;
    let isPaused = false;

    // Восстановление накопленного времени
    const storedSeconds = Number(localStorage.getItem(storageKey));

    let totalFocusSeconds = Number.isFinite(storedSeconds) && storedSeconds >= 0
        ? storedSeconds
        : 0;

    // ===== ОТОБРАЖЕНИЕ ВРЕМЕНИ =====

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;

        return String(minutes).padStart(2, "0") + ":" +
            String(secs).padStart(2, "0");
    }

    function updateDisplay() {
        timerDisplay.textContent = formatTime(remainingSeconds);
    }

    // ===== ОБНОВЛЕНИЕ СТАТИСТИКИ =====

    function updateFocusStat() {
        const minutes = Math.floor(totalFocusSeconds / 60);
        focusStat.textContent = minutes;
    }

    function saveFocusTime() {
        localStorage.setItem(storageKey, String(totalFocusSeconds));
        updateFocusStat();
    }

    // ===== СОСТОЯНИЕ КНОПОК =====

    function updateButtons() {
        const isRunning = intervalId !== null;

        startButton.disabled = isRunning;
        pauseButton.disabled = !isRunning;

        if (isPaused) {
            startButton.textContent = "▶ Продолжить";
        } else {
            startButton.textContent = "▶ Старт";
        }
    }

    // ===== ЗАВЕРШЕНИЕ ТАЙМЕРА =====

    function finishTimer() {
        clearInterval(intervalId);
        intervalId = null;
        isPaused = false;

        remainingSeconds = 0;
        updateDisplay();
        updateButtons();

        timerStatus.textContent = "🎉 Отлично! Учебная сессия завершена!";
    }

    // ===== ОБРАТНЫЙ ОТСЧЁТ =====

    function updateTimer() {
        if (intervalId === null) {
            return;
        }

        // Вычисляем оставшееся время по реальным часам
        const newRemaining = Math.max(
            0,
            Math.ceil((endTime - Date.now()) / 1000)
        );

        // Учитываем только фактически прошедшие секунды
        const elapsedSeconds = remainingSeconds - newRemaining;

        if (elapsedSeconds > 0) {
            totalFocusSeconds += elapsedSeconds;
            remainingSeconds = newRemaining;

            updateDisplay();
            saveFocusTime();
        }

        if (remainingSeconds === 0) {
            finishTimer();
        }
    }

    // ===== ЗАПУСК =====

    function startTimer() {
        if (intervalId !== null) {
            return;
        }

        if (remainingSeconds === 0) {
            remainingSeconds = Number(durationSelect.value) * 60;
        }

        endTime = Date.now() + remainingSeconds * 1000;

        intervalId = setInterval(updateTimer, 250);

        isPaused = false;
        timerStatus.textContent = "🎯 Сосредоточься на своей задаче!";

        updateButtons();
        updateDisplay();
    }

    // ===== ПАУЗА =====

    function pauseTimer() {
        if (intervalId === null) {
            return;
        }

        updateTimer();

        if (intervalId === null) {
            return;
        }

        clearInterval(intervalId);
        intervalId = null;

        isPaused = true;
        timerStatus.textContent = "⏸ Таймер на паузе";

        updateButtons();
    }

    // ===== СБРОС =====

    function resetTimer() {
        if (intervalId !== null) {
            updateTimer();
        }

        clearInterval(intervalId);
        intervalId = null;

        remainingSeconds = Number(durationSelect.value) * 60;
        isPaused = false;

        timerStatus.textContent = "Готов к продуктивной работе?";

        updateDisplay();
        updateButtons();
    }

    // ===== ОБРАБОТЧИКИ СОБЫТИЙ =====

    startButton.addEventListener("click", startTimer);
    pauseButton.addEventListener("click", pauseTimer);
    resetButton.addEventListener("click", resetTimer);

    durationSelect.addEventListener("change", resetTimer);

    // ===== НАЧАЛЬНОЕ СОСТОЯНИЕ =====

    updateDisplay();
    updateButtons();
    updateFocusStat();
});