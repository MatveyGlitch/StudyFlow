document.addEventListener("DOMContentLoaded", () => {
    // ===== ЭЛЕМЕНТЫ ПРОГРЕСС-БАРА =====

    const progressTrack = document.getElementById("progress-track");
    const progressFill = document.getElementById("progress-fill");
    const progressText = document.getElementById("progress-text");
    const progressDescription = document.getElementById("progress-description");

    // ===== ОБНОВЛЕНИЕ ПРОГРЕССА =====

    function updateProgress(total, completed) {
        // Рассчитываем процент выполненных задач
        const percent = total === 0
            ? 0
            : Math.round((completed / total) * 100);

        // Обновляем прогресс-бар
        progressFill.style.width = `${percent}%`;
        progressText.textContent = `${percent}%`;

        // Обновляем атрибуты доступности
        progressTrack.setAttribute("aria-valuenow", percent);

        // ===== МОТИВАЦИОННЫЕ СООБЩЕНИЯ =====

        let message = "";

        if (total === 0) {
            message = "Добавь задачи, чтобы начать отслеживать прогресс";
        } else if (percent === 0) {
            message = "🚀 Всё впереди! Начни с первой задачи";
        } else if (percent < 25) {
            message = "🌱 Хорошее начало! Продолжай двигаться вперёд";
        } else if (percent < 50) {
            message = "💪 Отличный темп! Ты на правильном пути";
        } else if (percent < 75) {
            message = "🔥 Уже больше половины пути позади!";
        } else if (percent < 100) {
            message = "⭐ Почти готово! Остался последний рывок";
        } else {
            message = "🎉 Поздравляем! Все задачи выполнены!";
        }

        if (total > 0) {
            progressDescription.textContent =
                `Выполнено ${completed} из ${total} задач. ${message}`;
        } else {
            progressDescription.textContent = message;
        }
    }

    // ===== СВЯЗЬ С TO-DO СПИСКОМ =====

    window.addEventListener("studyflow:tasks-updated", event => {
        const { total, completed } = event.detail;

        updateProgress(total, completed);
    });

    // ===== НАЧАЛЬНАЯ ЗАГРУЗКА =====

    // Статистика уже заполнена компонентом todo.js
    const initialTotal = Number(
        document.getElementById("stat-total").textContent
    );

    const initialCompleted = Number(
        document.getElementById("stat-completed").textContent
    );

    updateProgress(initialTotal, initialCompleted);
});