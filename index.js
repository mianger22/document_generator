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

        // Получение данных из формы
        // 1. Данные для задания
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
        // 2. Данные для акта
        const Number_patrol_act = document.getElementById("Number_patrol_act").value;
        const Date_patrol_act = document.getElementById("Date_patrol_act").value;
        const Patrol_report = document.getElementById("Patrol_report").value;
        const Is_there_photo_table = document.querySelector("#Is_there_photo_table").checked === true ? ", фототаблица" : "";
        // 3. Данные для фототаблицы
        const Object_leaflet = document.getElementById("Object_leaflet").value;
        const Village_leaflet = document.getElementById("Village_leaflet").value;
        const Number_informed_people = document.getElementById("Number_informed_people").value;
        const Village_informed_people = document.getElementById("Village_informed_people").value;
        

        // Функция, фиксирующая незаполненные поля
        function checkEmptyValues(variableObj) {
            const emptyVariableNames = [];
        
            for (const [key, value] of Object.entries(variableObj)) {
                if (value === null || value === undefined || value === '') {
                    emptyVariableNames.push(key);
                }
            }
        
            return emptyVariableNames;
        }
        
        // Проверка на пустые значения
        const results = checkEmptyValues( 
            { 
                Time_assignment_issue, Date_assignment_issue, Patrol_task_number, Date_issue_task,
                Patrol_date, Patrol_route_number, What_date_was_approved, Year_patrol,
                Person_issued_task, Full_name_senior_patroller, Full_name_junior_patroller, Number_patrol_act, 
                Date_patrol_act 
            }
        );

        if (results.length > 0) {
            custom_alert("Необходимо заполнить все поля!");

            // Подсвечивание незаполненных полей
            results.forEach(element => {
                document.getElementById(element).style.borderColor = "red";
            });
        } else {
            // Возвращение цвета границы полей к стандартному значению
            results.forEach(element => {
                document.getElementById(element).style.removeProperty('border-сolor');
            });

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
                    case 'мастер леса Советского участкового лесничества Капитонова Марина Александровна':
                        Senior_patroller = 'мастер леса Советского участкового лесничества Капитонова М.А.';
                        Declension_name_senior_patroller = 'мастером леса Советского участкового лесничества Капитоновой Мариной Александровной';
                        Initials_senior_patroller = 'Капитонова М.А.';
                        break;
                    case 'мастер леса Новгородского участкового лесничества Зайцев Даниил Алексеевич':
                        Senior_patroller = 'мастер леса Новгородского участкового лесничества Зайцев Д.А.';
                        Declension_name_senior_patroller = 'мастером леса Новгородского участкового лесничества Зайцевым Даниилом Алексеевичем';
                        Initials_senior_patroller = 'Зайцев Д.А.';
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
                    case 'мастер леса Советского участкового лесничества Капитонова Марина Александровна':
                        Junior_patroller = 'мастер леса Советского участкового лесничества Капитонова М.А.';
                        Declension_name_junior_patroller = 'мастером леса Советского участкового лесничества Капитоновой Мариной Александровной';
                        Initials_junior_patroller = 'Капитонова М.А.';
                        break;
                    case 'мастер леса Новгородского участкового лесничества Зайцев Даниил Алексеевич':
                        Junior_patroller = 'мастер леса Новгородского участкового лесничества Зайцев Д.А.';
                        Declension_name_junior_patroller = 'мастером леса Новгородского участкового лесничества Зайцевым Даниилом Алексеевичем';
                        Initials_junior_patroller = 'Зайцев Д.А.';
                        break;
                }

                // Создание переменных для хранения времени и протяжённости маршрута патрулирования
                let Patrol_time, Length_patrol;

                // Создание описания маршрута патрулирования
                switch (Patrol_route_number) {
                    case '70,1':
                        Patrol_route_declaration = 'квартал 128 (выдела 14,17,26,30,36,38), квартал 126 (выдела 8,7,15), квартал 228 (выдела 13,21,25), квартал 216 (выдела 17,18,19,23,30), квартал 213 (выдела 20,24,16), квартал 211 (выдела 20,21,24,30,32), квартал 199 (выдела 21,22,31,33,35), квартал 12 (выдела 7,10), квартал 13 (выдела 1,23,40,35)';
                        Patrol_time = '45 мин.';
                        Length_patrol = '11 км.';
                        break;
                    case '71,2':
                        Patrol_route_declaration = 'квартал 200 (выдела 49,50,51,4,6,7), квартал 191 (выдела 25,26,27), квартал 40 (выдела 19,20), квартал 201 (выдела 6,8,14,15,18,24,26,28,31), квартал 195 (выдела 11,12), квартал 196 (выдела 2,10,11,12)';
                        Patrol_time = '55 мин.';
                        Length_patrol = '7 км.';
                        break;
                    case '72,3':
                        Patrol_route_declaration = 'квартал 45 (выдела 7,9), квартал 30 (выдела 12,15,17,19), квартал 192 (выдела 3,13), квартал 82 (выдела 5,6,14,20,25), квартал 100 (выдела 14,19,21), квартал 105 (выдела 3,10,14,17,18), квартал 110 (выдела 9,8,17)';
                        Patrol_time = '1 ч. 35 мин.';
                        Length_patrol = '17 км.';
                        break;
                    case '73,4':
                        Patrol_route_declaration = 'квартал 229 (выдела 2,4,8,9,10,12,13,6,7,11), квартал 116 (выдела 9,13,15,7,18,5,11,12,16), квартал 117 (выдела 18,15,12,16,17,18,21), квартал 119 (выдела 7,16,3,2,17,6,13,14,15)';
                        Patrol_time = '2 ч. 10 мин.';
                        Length_patrol = '28 км.';
                        break;
                    case '74,5':
                        Patrol_route_declaration = 'квартал 240 (выдела 1,2,3,4,5,6,13,11,37,38,41,27,29), квартал 250 (выдела 2,3,5), квартал 257 (выдела 1,47,57), квартал 251 (выдела 1,3), квартал 252 (выдела 23,22,24,18,19)';
                        Patrol_time = '40 мин.';
                        Length_patrol = '12 км.';
                        break;
                    case '75,6':
                        Patrol_route_declaration = 'квартал 267 (выдела 12,23,11,8), квартал 265 (выдела 20,24,22), квартал 255 (выдела 2,5,7,8,9,10), квартал 254 (выдела 13,17,3,5,16,17,2), квартал 248 (выдела 27,28), квартал 247 (выдела 35,38,45,47,48,51,53,4,6,7,8,5,19,18,23), квартал 232 (выдела 2,4,3,5,6,10,11,21), квартал 233 (выдела 4,5,3,7,2), квартал 230 (выдела 2,3,4,8,9,10,11,12), квартал 227 (выдела 3,2,6,1,3), квартал 125 (выдела 1,2,3)';
                        Patrol_time = '25 мин.';
                        Length_patrol = '11 км.';
                        break;
                    case '76,7':
                        Patrol_route_declaration = 'квартал 226 (выдела 1,2,4,3,9,8,12), квартал 111 (выдела 4,7,8), квартал 106 (выдела 6,16,5,8), квартал 208 (выдела 6,17,20,10,9,5,7), квартал 207 (выдела 8,7,9,15,16,17), квартал 197 (выдела 9,12,8,14,11,18), квартал 198 (выдела 10,19,11)';
                        Patrol_time = '1 ч. 20 мин.';
                        Length_patrol = '20 км.';
                        break;
                    case '77,8':
                        Patrol_route_declaration = 'квартал 246 (выдела 17,18,19,20,21,22), квартал 257 (выдела 2,1,7,8,10), квартал 155 (выдела 14,26,28,31,13,15,23,40,30), квартал 244 (выдела 4,5,10,8,9,36,47,53), квартал 151 (выдела 9,18,17,12,13), квартал 243 (выдела 12), квартал 224 (выдела 31,32,37,38,41), квартал 223 (выдела 33,36,38,45,49,54,61), квартал 153 (выдел 41)';
                        Patrol_time = '1 ч. 55 мин.';
                        Length_patrol = '14 км.';
                        break;
                    case '78,9':
                        Patrol_route_declaration = 'квартал 225 (выдела 39,40,47,61,21,29,32), квартал 218 (выдела 14,11,12,13,20,19), квартал 86 (выдела 19,20,34,35,33,36), квартал 204 (выдела 16), квартал 203 (выдела 14,15)';
                        Patrol_time = '40 мин.';
                        Length_patrol = '12 км.';
                        break;
                }

                // Формирование нужного задания
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

                // Формирование нужного акта
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

                        // Создание отчёта о патрулировании
                        const Initial_report = `Во время патрулирования не было обнаружено ни нарушений лесного законодательства, ни лесозаготовительной техники, ни граждан, незаконно вывозящих древесину из лесного фонда. ${Patrol_report}, маршрут которого составил ${Length_patrol}`;

                        // Обработка документа (замена {user_name} на имя пользователя, {user_surname} на фамилию пользователя и т.д.)
                        doc.render({
                            Declension_name_senior_patroller, Initials_senior_patroller, Declension_name_junior_patroller, 
                            Initials_junior_patroller, Number_patrol_act, Date_patrol_act, Patrol_task_number, Date_issue_task, 
                            Patrol_route_declaration, Initial_report, Is_there_photo_table
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

                // Формирование нужной схемы
                fetch('Шаблон схемы проведённого патрулирования.docx')
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
                            Initials_senior_patroller, Number_patrol_act, Date_patrol_act, Patrol_time, Length_patrol
                        });

                        // Генерация и сохранение нового документа
                        const out = doc.getZip().generate({
                            type: "blob",
                            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        });

                        // Создание элемента ссылки для скачивания файла
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(out);
                        link.download = `Схема проведённого патрулирования по МБ л-ву.docx`;
                        link.click();

                        custom_alert("Готово!", "green")
                    })
                    .catch(error => {
                        console.error('Ошибка:', error);
                        alert('Ошибка! Смотри в console');
                    });

                // Формирование нужной фототаблицы
                if (Is_there_photo_table !== "") {
                    fetch('Шаблон фототаблицы по патрулированию.docx')
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
                                Number_patrol_act, Date_patrol_act, Patrol_date, Object_leaflet, Village_leaflet,
                                Number_informed_people, Village_informed_people
                            });

                            // Генерация и сохранение нового документа
                            const out = doc.getZip().generate({
                                type: "blob",
                                mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                            });

                            // Создание элемента ссылки для скачивания файла
                            const link = document.createElement('a');
                            link.href = URL.createObjectURL(out);
                            link.download = `Фототаблица проведённого патрулирования по МБ л-ву.docx`;
                            link.click();
                        })
                        .catch(error => {
                            console.error('Ошибка:', error);
                            alert('Ошибка! Смотри в console');
                        });
                }
            }
        }

        // Следить за состоянием полей, чтобы убирать красное обрамление, когда пользователь кликает по полю
        results.forEach(element => {
            document.getElementById(element).addEventListener("click", (elem) => {
                document.getElementById(element).style.borderColor = "green";

                // при уходе с поля, не заполнив его, граница снова окрашивается в красный
                document.getElementById(element).addEventListener('blur', function() {
                    if (this.value === "") {
                        document.getElementById(element).style.borderColor = "red";
                    }
                });
            });
        });
    });
});