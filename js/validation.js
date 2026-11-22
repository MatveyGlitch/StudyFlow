document.addEventListener("DOMContentLoaded", () => {
    // ===== ЭЛЕМЕНТЫ ФОРМЫ =====

    const form = document.getElementById("validation-form");
    const formMessage = document.getElementById("form-message");

    const username = document.getElementById("username");
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    const nameError = document.getElementById("name-error");
    const emailError = document.getElementById("email-error");
    const passwordError = document.getElementById("password-error");


    // ===== ПРОВЕРКА ИМЕНИ =====

    function validateName(value) {
        const name = value.trim();

        if (name === "") {
            return "Введите имя пользователя.";
        }

        if (name.length < 2 || name.length > 40) {
            return "Имя должно содержать от 2 до 40 символов.";
        }

        const namePattern = /^\p{L}+(?:[ '\-]\p{L}+)*$/u;

        if (!namePattern.test(name)) {
            return "Используйте только буквы, пробелы и дефисы.";
        }

        return "";
    }


    // ===== ПРОВЕРКА EMAIL =====

    function validateEmail(value) {
        const address = value.trim();

        if (address === "") {
            return "Введите электронную почту.";
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@.]{2,}$/;

        if (!emailPattern.test(address)) {
            return "Введите корректный email, например user@mail.com.";
        }

        return "";
    }


    // ===== ПРОВЕРКА ПАРОЛЯ =====

    function validatePassword(value) {
        if (value === "") {
            return "Введите пароль.";
        }

        if (value.length < 8) {
            return "Пароль должен содержать минимум 8 символов.";
        }

        if (!/\p{Ll}/u.test(value)) {
            return "Добавьте хотя бы одну строчную букву.";
        }

        if (!/\p{Lu}/u.test(value)) {
            return "Добавьте хотя бы одну заглавную букву.";
        }

        if (!/[0-9]/.test(value)) {
            return "Добавьте хотя бы одну цифру.";
        }

        return "";
    }


    // ===== НАСТРОЙКА ПОЛЕЙ =====

    const fields = [
        {
            input: username,
            error: nameError,
            validate: validateName,
            touched: false
        },
        {
            input: email,
            error: emailError,
            validate: validateEmail,
            touched: false
        },
        {
            input: password,
            error: passwordError,
            validate: validatePassword,
            touched: false
        }
    ];


    // ===== ОТОБРАЖЕНИЕ РЕЗУЛЬТАТА =====

    function validateField(field) {
        const message = field.validate(field.input.value);
        const isValid = message === "";

        field.error.textContent = message;

        field.input.classList.toggle("is-valid", isValid);
        field.input.classList.toggle("is-invalid", !isValid);

        field.input.setAttribute("aria-invalid", String(!isValid));

        return isValid;
    }


    // ===== ПРОВЕРКА ПРИ ВВОДЕ =====

    fields.forEach(field => {
        field.input.setAttribute("aria-describedby", field.error.id);

        // Проверка при выходе из поля
        field.input.addEventListener("blur", () => {
            field.touched = true;
            validateField(field);
        });

        // Повторная проверка при исправлении
        field.input.addEventListener("input", () => {
            formMessage.textContent = "";
            formMessage.className = "form-message";

            if (field.touched) {
                validateField(field);
            }
        });
    });


    // ===== ОТПРАВКА ФОРМЫ =====

    form.addEventListener("submit", event => {
        event.preventDefault();

        let isFormValid = true;
        let firstInvalidField = null;

        fields.forEach(field => {
            field.touched = true;

            if (!validateField(field)) {
                isFormValid = false;

                if (firstInvalidField === null) {
                    firstInvalidField = field.input;
                }
            }
        });

        if (isFormValid) {
            formMessage.textContent =
                "✓ Все данные введены корректно!";

            formMessage.className = "form-message success";
        } else {
            formMessage.textContent =
                "Пожалуйста, исправьте ошибки в форме.";

            formMessage.className = "form-message error";

            firstInvalidField.focus();
        }
    });
});