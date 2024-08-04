// Общие функции
const custom_alert = (message) => {
    return window.Swal.fire({
        title: message,
        width: 400,
        height: 200,
        padding: "1em",
        color: "#716add",
        background: "#fff url(/pictures/trees_phone.png)",
        backdrop: `
            rgba(0,0,123,0.4)
            url("/pictures/nyan-cat.gif")
            left top
            no-repeat
        `
    });
}

// Функции проверки введённого значения на соответствие нужному формату
const check_format_Patrol_route_number = (value) => /^\d{2} \d$/.test(value);
const check_format_Time_assignment_issue = (value) => /^\d{2} \d{2}$/.test(value);

// Проверка на корректность введённого времени
function validate_getted_time(getted_time) {
    let parts = getted_time.split(' ');

    if (parts.length !== 2) {
        return false; // Неверный формат ввода
    }

    let firstPart = parseInt(parts[0], 10);
    let secondPart = parseInt(parts[1], 10);

    if (isNaN(firstPart) || isNaN(secondPart)) {
        return false; // Введены не числовые значения
    }

    if (firstPart <= 23 && secondPart <= 59) {
        return true;
    } else {
        return false;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Реализация смены форм
    document.getElementById('formSelect').addEventListener('change', function() {
        document.querySelectorAll('.hidden').forEach(container => {
            container.style.display = 'none';
        });
        
        const selectedForm = this.value;
        document.getElementById(selectedForm).style.display = 'block';
    });

    // Инициализация выбора даты
    let array_selected_dates = document.getElementsByClassName('date_selection');

    for (let index = 0; index < array_selected_dates.length; index++) {
        const received_date = array_selected_dates[index];

        const monthNames = [
            'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
            'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
        ];

        datepicker(received_date, {
            formatter: (input, date) => {
                const day = `0${date.getDate()}`.slice(-2);
                const month = monthNames[date.getMonth()];
                const year = date.getFullYear();
                input.value = `«${day}» ${month} ${year}`;
            },
        });
    }

    // Генерация задания на проведение патрулирования
    document.getElementById('generate_patrol_task').addEventListener('click', (e) => {
        e.preventDefault();

        let Time_assignment_issue = document.getElementById("Time_assignment_issue").value;
        const Date_assignment_issue = document.getElementById("Date_assignment_issue").value;
        const Task_number = document.getElementById("Task_number").value;
        const Date_issue_task = document.getElementById("Date_issue_task").value;
        const Patrol_date = document.getElementById("Patrol_date").value;
        let Patrol_route_number = document.getElementById("Patrol_route_number").value;
        const What_date_was_approved = document.getElementById("What_date_was_approved").value;
        const Year_patrol = document.getElementById("Year_patrol").value;
        const Person_issued_task = document.getElementById("Person_issued_task").value;
        const Senior_patroller = document.getElementById("Senior_patroller").value;
        const Junior_patroller = document.getElementById("Junior_patroller").value;
        const Additional_order = document.querySelector("#Additional_order").checked === true
            ? " (приказ директора от _____._____._____ года № _____)" : "";

        if (Time_assignment_issue === "" || Date_assignment_issue === "" || Task_number === "" || Date_issue_task === "" ||
            Patrol_date === "" || Patrol_route_number === "" || What_date_was_approved === "" || Year_patrol === "" ||
            Person_issued_task === "" || Senior_patroller === "" || Junior_patroller === "") 
        {
            custom_alert("Необходимо заполнить все поля!");
        } else {
            if (check_format_Patrol_route_number(Patrol_route_number) === false) {
                custom_alert(`
                    Номер маршрута должен быть вида 
                    75 6`);
            } else {
                if (check_format_Time_assignment_issue(Time_assignment_issue) === false) {
                    custom_alert("Время выдачи задания должно быть вида 12 30");
                } else {
                    if (validate_getted_time(Time_assignment_issue) === false) {
                        custom_alert("Время выдачи задания должно быть корректным"); 
                    } else {
                        if (Task_number.length > 4) {
                            custom_alert("Номер задания должен быть не более 4 цифр"); 
                        } else {
                            Time_assignment_issue = `${Time_assignment_issue.split(" ")[0]} часов ${Time_assignment_issue.split(" ")[1]} минут`;
                            Patrol_route_number = Patrol_route_number.replace(/ /g, ',');

                            // Создание фамилии с инициалами из полного имени
                            let Initials_senior_patroller, Initials_junior_patroller;

                            // Создание инициалов старшего патрульной группы
                            switch (Senior_patroller) {
                                case 'мастер леса Мясноборского участкового лесничества Устинов Дмитрий Сергеевич':
                                    Initials_senior_patroller = 'мастер леса Мясноборского участкового лесничества Устинов Д.С.';
                                    break;
                                case 'участковый лесничий Ермолинского участкового лесничества Кузнецова Елизавета Михайловна':
                                    Initials_senior_patroller = 'участковый лесничий Ермолинского участкового лесничества Кузнецова Е.М.';
                                    break;
                                case 'участковый лесничий Новгородского участкового лесничества Маркова Ирина Фирсовна':
                                    Initials_senior_patroller = 'участковый лесничий Новгородского участкового лесничества Маркова И.Ф.';
                                    break;
                            }

                            // Создание инициалов младшего патрульной группы
                            switch (Junior_patroller) {
                                case 'мастер леса Мясноборского участкового лесничества Устинов Дмитрий Сергеевич':
                                    Initials_junior_patroller = 'мастер леса Мясноборского участкового лесничества Устинов Д.С.';
                                    break;
                                case 'участковый лесничий Ермолинского участкового лесничества Кузнецова Елизавета Михайловна':
                                    Initials_junior_patroller = 'участковый лесничий Ермолинского участкового лесничества Кузнецова Е.М.';
                                    break;
                                case 'участковый лесничий Новгородского участкового лесничества Маркова Ирина Фирсовна':
                                    Initials_junior_patroller = 'участковый лесничий Новгородского участкового лесничества Маркова И.Ф.';
                                    break;
                            }

                            // Загрузка заранее определенного файла, лежащего в той же директории
                            fetch('Шаблон задания на патрулирование.docx')
                                .then(response => {
                                    if (!response.ok) {
                                        throw new Error('Network response was not ok ' + response.statusText);
                                    }
                                    return response.arrayBuffer();
                                })
                                .then(data => {
                                    const zip = new PizZip(data);
                                    const doc = new window.docxtemplater(zip, {
                                        paragraphLoop: true,
                                        linebreaks: true,
                                    });

                                    // Обработка документа (замена {user_name} на имя пользователя, {user_surname} на фамилию пользователя и т.д.)
                                    doc.render({
                                        Initials_senior_patroller, Initials_junior_patroller, Senior_patroller, 
                                        Junior_patroller, Additional_order, Time_assignment_issue, Date_assignment_issue, 
                                        Task_number, Date_issue_task, Patrol_date, Patrol_route_number, What_date_was_approved, 
                                        Year_patrol, Year_patrol, Person_issued_task
                                    });

                                    // Генерация и сохранение нового документа
                                    const out = doc.getZip().generate({
                                        type: "blob",
                                        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                                    });

                                    // Создание элемента ссылки для скачивания файла
                                    const link = document.createElement('a');
                                    link.href = URL.createObjectURL(out);
                                    link.download = `Задание на проведение патрулирования по МБ л-ву № ${Task_number}.docx`;
                                    link.click();

                                    custom_alert("Конец")
                                })
                                .catch(error => {
                                    console.error('Ошибка:', error);
                                    alert('Ошибка! Смотри в console');
                                });
                        }
                    }
                }
            }
        }
    });

    // Генерация акта о проведённом патрулировании
    document.getElementById('generate_patrol_report').addEventListener('click', (e) => {
        e.preventDefault();

        const Number_patrol_act = document.getElementById("Number_patrol_act").value;
        const Date_patrol_act = document.getElementById("Date_patrol_act").value;
        const Patrol_task_number__act = document.getElementById("Patrol_task_number__act").value;
        const Date_patrol_task__act = document.getElementById("Date_patrol_task__act").value;
        const Senior_patroller__act = document.getElementById("Senior_patroller__act").value;
        const Junior_patroller__act = document.getElementById("Junior_patroller__act").value;
        const Patrol_route_number__act = document.getElementById("Patrol_route_number__act").value;
        const Patrol_report__act = document.getElementById("Patrol_report__act").value;
        const Is_there_photo_table = document.querySelector("#Is_there_photo_table").checked === true
        ? " (приказ директора от _____._____._____ года № _____)" : "";

        if (Number_patrol_act === "" || Date_patrol_act === "" || Patrol_task_number__act === "" || Date_patrol_task__act === "" ||
            Senior_patroller__act === "" || Junior_patroller__act === "" || Patrol_route_number__act === "" || Patrol_report__act === "") 
        {
            custom_alert("Необходимо заполнить все поля!");
        } else {
            // Создание фамилии с инициалами из полного имени
            let Initials_senior_patroller__act, Initials_junior_patroller__act;

            // Создание инициалов старшего патрульной группы
            switch (Senior_patroller__act) {
                case 'мастером леса Мясноборского участкового лесничества Устиновым Дмитрием Сергеевичем':
                    Initials_senior_patroller__act = 'Устинов Д.С.';
                    break;
                case 'участковым лесничим Ермолинского участкового лесничества Кузнецовой Елизаветой Михайловной':
                    Initials_senior_patroller__act = 'Кузнецова Е.М.';
                    break;
                case 'участковым лесничим Новгородского участкового лесничества Марковой Ириной Фирсовной':
                    Initials_senior_patroller__act = 'Маркова И.Ф.';
                    break;
            }

            // Создание инициалов младшего патрульной группы
            switch (Junior_patroller__act) {
                case 'мастером леса Мясноборского участкового лесничества Устиновым Дмитрием Сергеевичем':
                    Initials_junior_patroller__act = 'Устинов Д.С.';
                    break;
                case 'участковым лесничим Ермолинского участкового лесничества Кузнецовой Елизаветой Михайловной':
                    Initials_junior_patroller__act = 'Кузнецова Е.М.';
                    break;
                case 'участковым лесничим Новгородского участкового лесничества Марковой Ириной Фирсовной':
                    Initials_junior_patroller__act = 'Маркова И.Ф.';
                    break;
            }

            // Загрузка заранее определенного файла, лежащего в той же директории
            fetch('Акт задания на проведение патрулирования.docx')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.arrayBuffer();
                })
                .then(data => {
                    const zip = new PizZip(data);
                    const doc = new window.docxtemplater(zip, {
                        paragraphLoop: true,
                        linebreaks: true,
                    });

                    // Обработка документа (замена {user_name} на имя пользователя, {user_surname} на фамилию пользователя и т.д.)
                    doc.render({
                        Initials_senior_patroller__act, Initials_junior_patroller__act, Senior_patroller__act, Junior_patroller__act, 
                        Number_patrol_act, Date_patrol_act, Patrol_task_number__act, Date_patrol_task__act, Patrol_route_number__act, 
                        Patrol_report__act, Is_there_photo_table
                    });

                    // Генерация и сохранение нового документа
                    const out = doc.getZip().generate({
                        type: "blob",
                        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    });

                    // Создание элемента ссылки для скачивания файла
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(out);
                    link.download = `Акт о проведённом патрулировании по МБ л-ву № ${Number_patrol_act}.docx`;
                    link.click();

                    custom_alert("Готово!")
                })
                .catch(error => {
                    console.error('Ошибка:', error);
                    alert('Ошибка! Смотри в console');
                });
        };
    });
});