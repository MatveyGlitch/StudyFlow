document.addEventListener("DOMContentLoaded", () => {
    // ===== ЭЛЕМЕНТЫ КОМПОНЕНТА =====

    const cards = document.querySelectorAll(".subject-card");
    const hoverMessage = document.getElementById("hover-message");

    const defaultMessage = "Выбери интересующий предмет.";

    // ===== ИНФОРМАЦИЯ О ПРЕДМЕТАХ =====

    const subjectMessages = {
        HTML: "🌐 HTML — основа веб-разработки. Изучай структуру страниц и семантические теги.",

        CSS: "🎨 CSS — создавай красивые интерфейсы, адаптивную верстку и анимации.",

        JavaScript: "⚡ JavaScript — добавляй интерактивность и создавай динамические приложения."
    };


    // ===== АКТИВАЦИЯ КАРТОЧКИ =====

    function activateCard(card) {
        // Снимаем выделение с остальных карточек
        cards.forEach(item => {
            const isActive = item === card;

            item.classList.toggle("is-hovered", isActive);

            const hint = item.querySelector(".subject-hint");

            hint.textContent = isActive
                ? "✨ Карточка активна"
                : "Наведи курсор";
        });

        // Определяем название выбранного предмета
        const subject = card.querySelector("h3").textContent.trim();

        // Показываем соответствующую информацию
        hoverMessage.textContent = subjectMessages[subject];

        // Анимируем появление сообщения
        hoverMessage.animate(
            [
                {
                    opacity: 0,
                    transform: "translateY(8px)"
                },
                {
                    opacity: 1,
                    transform: "translateY(0)"
                }
            ],
            {
                duration: 300,
                easing: "ease-out"
            }
        );
    }


    // ===== СНЯТИЕ ВЫДЕЛЕНИЯ =====

    function deactivateCard(card) {
        card.classList.remove("is-hovered");

        const hint = card.querySelector(".subject-hint");
        hint.textContent = "Наведи курсор";

        // Проверяем, осталась ли активная карточка
        const activeCard = Array.from(cards).find(item =>
            item !== card &&
            (item.matches(":hover") || document.activeElement === item)
        );

        if (activeCard) {
            activateCard(activeCard);
        } else {
            hoverMessage.textContent = defaultMessage;
        }
    }


    // ===== ОБРАБОТЧИКИ СОБЫТИЙ =====

    cards.forEach(card => {
        // Наведение курсора
        card.addEventListener("mouseenter", () => {
            activateCard(card);
        });

        // Уход курсора
        card.addEventListener("mouseleave", () => {
            if (document.activeElement !== card) {
                deactivateCard(card);
            }
        });

        // Получение фокуса с клавиатуры
        card.addEventListener("focus", () => {
            activateCard(card);
        });

        // Потеря фокуса
        card.addEventListener("blur", () => {
            if (!card.matches(":hover")) {
                deactivateCard(card);
            }
        });
    });
});