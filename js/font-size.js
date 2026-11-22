document.addEventListener("DOMContentLoaded", () => {
    // ===== ЭЛЕМЕНТЫ КОМПОНЕНТА =====

    const readingText = document.getElementById("reading-text");
    const fontValue = document.getElementById("font-value");

    const decreaseButton = document.getElementById("font-decrease");
    const increaseButton = document.getElementById("font-increase");
    const resetButton = document.getElementById("font-reset");


    // ===== НАСТРОЙКИ РАЗМЕРА =====

    const defaultSize = 16;
    const minSize = 12;
    const maxSize = 28;
    const step = 2;

    const storageKey = "studyflow_font_size";


    // ===== ЗАГРУЗКА СОХРАНЁННОГО РАЗМЕРА =====

    function loadFontSize() {
        const savedSize = localStorage.getItem(storageKey);

        if (savedSize === null) {
            return defaultSize;
        }

        const size = Number(savedSize);

        if (!Number.isFinite(size) ||
            size < minSize ||
            size > maxSize ||
            (size - minSize) % step !== 0) {
            return defaultSize;
        }

        return size;
    }

    let fontSize = loadFontSize();


    // ===== ОБНОВЛЕНИЕ РАЗМЕРА =====

    function updateFontSize() {
        // Применяем размер к области чтения
        readingText.style.fontSize = `${fontSize}px`;

        // Отображаем выбранный размер
        fontValue.textContent = `${fontSize} px`;

        // Блокируем кнопки на границах диапазона
        decreaseButton.disabled = fontSize <= minSize;
        increaseButton.disabled = fontSize >= maxSize;

        // Сохраняем настройку
        localStorage.setItem(storageKey, String(fontSize));
    }


    // ===== УВЕЛИЧЕНИЕ ШРИФТА =====

    function increaseFontSize() {
        fontSize = Math.min(fontSize + step, maxSize);
        updateFontSize();
    }


    // ===== УМЕНЬШЕНИЕ ШРИФТА =====

    function decreaseFontSize() {
        fontSize = Math.max(fontSize - step, minSize);
        updateFontSize();
    }


    // ===== СБРОС К СТАНДАРТНОМУ РАЗМЕРУ =====

    function resetFontSize() {
        fontSize = defaultSize;
        updateFontSize();
    }


    // ===== ОБРАБОТЧИКИ СОБЫТИЙ =====

    increaseButton.addEventListener("click", increaseFontSize);
    decreaseButton.addEventListener("click", decreaseFontSize);
    resetButton.addEventListener("click", resetFontSize);


    // ===== НАЧАЛЬНОЕ СОСТОЯНИЕ =====

    updateFontSize();
});