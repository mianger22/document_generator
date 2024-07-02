document.addEventListener("DOMContentLoaded", () => {
    const output = document.getElementById("output");

    document.getElementById('generate_patrol_task').addEventListener('click', (e) => {
        e.preventDefault();

        // Получение данных из формы
        let Time_assignment_issue = document.getElementById("Time_assignment_issue").value;
        Time_assignment_issue = `${Time_assignment_issue.split(":")[0]} часов ${Time_assignment_issue.split(":")[1]} минут`;
        const Date_assignment_issue = document.getElementById("Date_assignment_issue").value;
        const Task_number = document.getElementById("Task_number").value;
        const Date_issue_task = document.getElementById("Date_issue_task").value;
        const Patrol_date = document.getElementById("Patrol_date").value;
        const Patrol_route_number = document.getElementById("Patrol_route_number").value;
        const What_date_was_approved = document.getElementById("What_date_was_approved").value;
        const Year_patrol = document.getElementById("Year_patrol").value;
        const Person_issued_task = document.getElementById("Person_issued_task").value;
        const Senior_patroller = document.getElementById("Senior_patroller").value;
        const Junior_patroller = document.getElementById("Junior_patroller").value;
        const Additional_order = document.getElementById("Additional_order").value === true 
            ? " (приказ директора от _____._____._____ года № _____)" : "";

        // Проверка на заполненность формы
        if (Time_assignment_issue === "" || Date_assignment_issue === "" || Task_number === "" || Date_issue_task === "" ||
            Patrol_date === "" || Patrol_route_number === "" || What_date_was_approved === "" || Year_patrol === "" ||
            Person_issued_task === "" || Senior_patroller === "" || Junior_patroller === "") 
        {
            window.Swal.fire({
                title: "Необходимо заполнить все поля!",
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
        } else {
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

                    output.textContent = `Готово!`;
                })
                .catch(error => {
                    console.error('Ошибка:', error);
                    alert('Не удалось загрузить файл!');
                });
        }
    });
});