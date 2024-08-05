// Общие функции
const custom_alert = (message, color = "red") => {
    return window.Swal.fire({
        title: message,
        width: 400,
        height: 200,
        padding: "1em",
        color: color,
        background: "#fff url(/pictures/trees_phone.png)",
    });
}

// Функции проверки введённого значения на соответствие нужному формату
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

    // Генерация акта, задания, касаемо проведённого патрулирования
    document.getElementById('create_report_conducted_patrol').addEventListener('click', (e) => {
        e.preventDefault();

        let Time_assignment_issue = document.getElementById("Time_assignment_issue").value;
        const Date_assignment_issue = document.getElementById("Date_assignment_issue").value;
        const Patrol_task_number = document.getElementById("Patrol_task_number").value;
        const Date_issue_task = document.getElementById("Date_issue_task").value;
        const Patrol_date = document.getElementById("Patrol_date").value;
        let Patrol_route_number = document.getElementById("Patrol_route_number").value;
        const What_date_was_approved = document.getElementById("What_date_was_approved").value;
        const Year_patrol = document.getElementById("Year_patrol").value;
        const Person_issued_task = document.getElementById("Person_issued_task").value;
        const Full_name_senior_patroller = document.getElementById("Full_name_senior_patroller").value;
        const Full_name_junior_patroller = document.getElementById("Full_name_junior_patroller").value;
        const Additional_order = document.querySelector("#Additional_order").checked === true
            ? " (приказ директора от _____._____._____ года № _____)" : "";
        const Number_patrol_act = document.getElementById("Number_patrol_act").value;
        const Date_patrol_act = document.getElementById("Date_patrol_act").value;
        const Patrol_report = document.getElementById("Patrol_report").value;
        const Is_there_photo_table = document.querySelector("#Is_there_photo_table").checked === true ? ", фототаблица" : "";

        if (Time_assignment_issue === "" || Date_assignment_issue === "" || Patrol_task_number === "" || Date_issue_task === "" ||
            Patrol_date === "" || Patrol_route_number === "" || What_date_was_approved === "" || Year_patrol === "" ||
            Person_issued_task === "" || Full_name_senior_patroller === "" || Full_name_junior_patroller === "" || Number_patrol_act === "" || 
            Date_patrol_act === "" || Patrol_report === "") 
        {
            custom_alert("Необходимо заполнить все поля!");
        } else {
            if (Number_patrol_act.length > 4) {
                custom_alert(`Номер акта должен быть не более 4 цифр`);
            } else if (Patrol_task_number.length > 4) {
                custom_alert("Номер задания должен быть не более 4 цифр"); 
            } else if (check_format_Time_assignment_issue(Time_assignment_issue) === false) {
                custom_alert("Время выдачи задания должно быть вида 12 30");
            } else if (validate_getted_time(Time_assignment_issue) === false) {
                custom_alert("Время выдачи задания должно быть корректным"); 
            } else {
                Time_assignment_issue = `${Time_assignment_issue.split(" ")[0]} часов ${Time_assignment_issue.split(" ")[1]} минут`;

                // Создание фамилии с инициалами из полного имени
                let Senior_patroller, Declension_name_senior_patroller, Initials_senior_patroller, 
                Junior_patroller, Declension_name_junior_patroller, Initials_junior_patroller,
                Patrol_route_declaration;

                // Создание инициалов старшего патрульной группы
                switch (Full_name_senior_patroller) {
                    case 'мастер леса Мясноборского участкового лесничества Устинов Дмитрий Сергеевич':
                        Senior_patroller = 'мастер леса Мясноборского участкового лесничества Устинов Д.С.';
                        Declension_name_senior_patroller = 'мастером леса Мясноборского участкового лесничества Устиновым Дмитрием Сергеевичем';
                        Initials_senior_patroller = 'Устинов Д.С.';
                        break;
                    case 'участковый лесничий Ермолинского участкового лесничества Кузнецова Елизавета Михайловна':
                        Senior_patroller = 'участковый лесничий Ермолинского участкового лесничества Кузнецова Е.М.';
                        Declension_name_senior_patroller = 'участковым лесничим Ермолинского участкового лесничества Кузнецовой Елизаветой Михайловной';
                        Initials_senior_patroller = 'Кузнецова Е.М.';
                        break;
                    case 'участковый лесничий Новгородского участкового лесничества Маркова Ирина Фирсовна':
                        Senior_patroller = 'участковый лесничий Новгородского участкового лесничества Маркова И.Ф.';
                        Declension_name_senior_patroller = 'участковым лесничим Новгородского участкового лесничества Марковой Ириной Фирсовной';
                        Initials_senior_patroller = 'Маркова И.Ф.';
                        break;
                }

                // Создание инициалов младшего патрульной группы
                switch (Full_name_junior_patroller) {
                    case 'мастер леса Мясноборского участкового лесничества Устинов Дмитрий Сергеевич':
                        Junior_patroller = 'мастер леса Мясноборского участкового лесничества Устинов Д.С.';
                        Declension_name_junior_patroller = 'мастером леса Мясноборского участкового лесничества Устиновым Дмитрием Сергеевичем';
                        Initials_junior_patroller = 'Устинов Д.С.';
                        break;
                    case 'участковый лесничий Ермолинского участкового лесничества Кузнецова Елизавета Михайловна':
                        Junior_patroller = 'участковый лесничий Ермолинского участкового лесничества Кузнецова Е.М.';
                        Declension_name_junior_patroller = 'участковым лесничим Ермолинского участкового лесничества Кузнецовой Елизаветой Михайловной';
                        Initials_junior_patroller = 'Кузнецова Е.М.';
                        break;
                    case 'участковый лесничий Новгородского участкового лесничества Маркова Ирина Фирсовна':
                        Junior_patroller = 'участковый лесничий Новгородского участкового лесничества Маркова И.Ф.';
                        Declension_name_junior_patroller = 'участковым лесничим Новгородского участкового лесничества Марковой Ириной Фирсовной';
                        Initials_junior_patroller = 'Маркова И.Ф.';
                        break;
                }

                // Создание описания маршрута патрулирования
                switch (Patrol_route_number) {
                    case '70,1':
                        Patrol_route_declaration = 'квартал 128 (выдела 14,17,26,30,36,38), квартал 126 (выдела 8,7,15), квартал 228 (выдела 13,21,25), квартал 216 (выдела 17,18,19,23,30), квартал 213 (выдела 20,24,16), квартал 211 (выдела 20,21,24,30,32), квартал 199 (выдела 21,22,31,33,35), квартал 12 (выдела 7,10), квартал 13 (выдела 1,23,40,35)';
                        break;
                    case '71,2':
                        Patrol_route_declaration = 'квартал 200 (выдела 49,50,51,4,6,7), квартал 191 (выдела 25,26,27), квартал 40 (выдела 19,20), квартал 201 (выдела 6,8,14,15,18,24,26,28,31), квартал 195 (выдела 11,12), квартал 196 (выдела 2,10,11,12)';
                        break;
                    case '72,3':
                        Patrol_route_declaration = 'квартал 45 (выдела 7,9), квартал 30 (выдела 12,15,17,19), квартал 192 (выдела 3,13), квартал 82 (выдела 5,6,14,20,25), квартал 100 (выдела 14,19,21), квартал 105 (выдела 3,10,14,17,18), квартал 110 (выдела 9,8,17)';
                        break;
                    case '73,4':
                        Patrol_route_declaration = 'квартал 229 (выдела 2,4,8,9,10,12,13,6,7,11), квартал 116 (выдела 9,13,15,7,18,5,11,12,16), квартал 117 (выдела 18,15,12,16,17,18,21), квартал 119 (выдела 7,16,3,2,17,6,13,14,15)';
                        break;
                    case '74,5':
                        Patrol_route_declaration = 'квартал 240 (выдела 1,2,3,4,5,6,13,11,37,38,41,27,29), квартал 250 (выдела 2,3,5), квартал 257 (выдела 1,47,57), квартал 251 (выдела 1,3), квартал 252 (выдела 23,22,24,18,19)';
                        break;
                    case '75,6':
                        Patrol_route_declaration = 'НЕТ ИНФОРМАЦИИ';
                        break;
                    case '76,7':
                        Patrol_route_declaration = 'НЕТ ИНФОРМАЦИИ';
                        break;
                    case '77,8':
                        Patrol_route_declaration = 'НЕТ ИНФОРМАЦИИ';
                        break;
                    case '78,9':
                        Patrol_route_declaration = 'НЕТ ИНФОРМАЦИИ';
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
                            Full_name_senior_patroller, Senior_patroller, Full_name_junior_patroller, 
                            Junior_patroller, Additional_order, Time_assignment_issue, Date_assignment_issue, 
                            Patrol_task_number, Date_issue_task, Patrol_date, Patrol_route_number, What_date_was_approved, 
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
                        link.download = `Задание на проведение патрулирования по МБ л-ву № ${Patrol_task_number}.docx`;
                        link.click();

                        custom_alert("Готово!", "green")
                    })
                    .catch(error => {
                        console.error('Ошибка:', error);
                        alert('Ошибка! Смотри в console');
                    });

                // Загрузка заранее определенного файла, лежащего в той же директории
                fetch('Шаблон акта о проведённом патрулировании.docx')
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
                            Declension_name_senior_patroller, Initials_senior_patroller, Declension_name_junior_patroller, 
                            Initials_junior_patroller, Number_patrol_act, Date_patrol_act, Patrol_task_number, Date_issue_task, 
                            Patrol_route_declaration, Patrol_report, Is_there_photo_table
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

                        custom_alert("Готово!", "green")
                    })
                    .catch(error => {
                        console.error('Ошибка:', error);
                        alert('Ошибка! Смотри в console');
                    });
            }
        }
    });
});