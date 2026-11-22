document.addEventListener("DOMContentLoaded", () => {
    // ===== ЭЛЕМЕНТЫ АККОРДЕОНА =====

    const accordion = document.querySelector(".accordion");
    const items = accordion.querySelectorAll(".accordion-item");

    // ===== ОТКРЫТИЕ И ЗАКРЫТИЕ =====

    function closeItem(item) {
        const button = item.querySelector(".accordion-trigger");
        const panel = item.querySelector(".accordion-panel");

        item.classList.remove("is-open");
        button.setAttribute("aria-expanded", "false");
        panel.hidden = true;
    }

    function openItem(item) {
        const button = item.querySelector(".accordion-trigger");
        const panel = item.querySelector(".accordion-panel");

        item.classList.add("is-open");
        button.setAttribute("aria-expanded", "true");
        panel.hidden = false;
    }

    // ===== ОБРАБОТКА НАЖАТИЙ =====

    items.forEach(item => {
        const button = item.querySelector(".accordion-trigger");

        button.addEventListener("click", () => {
            const isOpen = item.classList.contains("is-open");

            // Закрываем все открытые разделы
            items.forEach(closeItem);

            // Если раздел был закрыт — открываем его
            if (!isOpen) {
                openItem(item);
            }
        });
    });
});