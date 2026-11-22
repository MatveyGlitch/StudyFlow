document.addEventListener("DOMContentLoaded", () => {
    // ===== ТЕКУЩАЯ ДАТА =====

    const currentDate = document.getElementById("current-date");
    const today = new Date();

    const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    currentDate.textContent = dateFormatter.format(today);


    // ===== НЕДЕЛЬНЫЙ КАЛЕНДАРЬ =====

    const weekGrid = document.getElementById("week-grid");
    const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

    function renderCalendar() {
        weekGrid.innerHTML = "";

        const current = new Date();
        const monday = new Date(
            current.getFullYear(),
            current.getMonth(),
            current.getDate()
        );

        const dayOfWeek = (monday.getDay() + 6) % 7;
        monday.setDate(monday.getDate() - dayOfWeek);

        for (let i = 0; i < 7; i++) {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);

            const dayCard = document.createElement("div");
            dayCard.classList.add("week-day");

            const dayName = document.createElement("span");
            dayName.classList.add("week-day-name");
            dayName.textContent = weekDays[i];

            const dayNumber = document.createElement("span");
            dayNumber.classList.add("week-day-number");
            dayNumber.textContent = date.getDate();

            if (date.toDateString() === current.toDateString()) {
                dayCard.classList.add("today");
                dayCard.setAttribute("aria-current", "date");
            }

            dayCard.title = dateFormatter.format(date);

            dayCard.append(dayName, dayNumber);
            weekGrid.appendChild(dayCard);
        }
    }

    renderCalendar();


    // ===== НАВИГАЦИЯ ПО РАЗДЕЛАМ =====

    const navLinks = document.querySelectorAll(".sidebar-nav .nav-link");

    const sections = Array.from(navLinks)
        .map(link => document.querySelector(link.getAttribute("href")))
        .filter(Boolean);

    function setActiveSection(sectionId) {
        navLinks.forEach(link => {
            const isActive = link.getAttribute("href") === "#" + sectionId;

            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            const sectionId = link.getAttribute("href").slice(1);
            setActiveSection(sectionId);
        });
    });


    // ===== ПОДСВЕТКА ПРИ ПРОКРУТКЕ =====

    function updateActiveSection() {
        const scrollPosition = window.scrollY + 180;
        let activeSection = sections[0];

        for (const section of sections) {
            if (section.offsetTop <= scrollPosition) {
                activeSection = section;
            }
        }

        const pageBottom = window.scrollY + window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        if (pageBottom >= documentHeight - 5) {
            activeSection = sections[sections.length - 1];
        }

        if (activeSection) {
            setActiveSection(activeSection.id);
        }
    }

    window.addEventListener("scroll", updateActiveSection, {
        passive: true
    });

    window.addEventListener("resize", updateActiveSection);

    updateActiveSection();
});