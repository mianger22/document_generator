document.addEventListener("DOMContentLoaded", () => {
    const output = document.getElementById("output");

    document.getElementById('generate_patrol_task').addEventListener('click', (e) => {
        e.preventDefault();

        // Получение данных из формы
        const Name_senior_patroller = document.getElementById("Name_senior_patroller").value;
        const Name_junior_patroller = document.getElementById("Name_junior_patroller").value;
        const Time_assignment_issue = document.getElementById("Time_assignment_issue").value;
        const Date_assignment_issue = document.getElementById("Date_assignment_issue").value;
        const Task_number = document.getElementById("Task_number").value;
        const Date_issue_task = document.getElementById("Date_issue_task").value;
        const Patrol_date = document.getElementById("Patrol_date").value;
        const Patrol_route_number = document.getElementById("Patrol_route_number").value;
        const What_date_was_approved = document.getElementById("What_date_was_approved").value;
        const Year_patrol = document.getElementById("Year_patrol").value;
        const Person_issued_task = document.getElementById("Person_issued_task").value;
        const Position_senior_patroller = document.getElementById("Position_senior_patroller").value;
        const Position_junior_patroller = document.getElementById("Position_junior_patroller").value;
        const Additional_order = document.getElementById("Additional_order").value === true 
            ? "(приказ директора от _____._____._____ года № _____)" : "";

        // Создание фамилии с инициалами из полного имени
        let Initials_senior_patroller, Initials_junior_patroller;

        switch (Name_senior_patroller) {
            case 'Устинов Дмитрий Сергеевич':
                Initials_senior_patroller = Initials_junior_patroller = 'Устинов Д.С.';
                break;
            case 'Кузнецова Елизавета Михайловна':
                Initials_senior_patroller = Initials_junior_patroller = 'Кузнецова Е.М.';
                break;
            case 'Маркова Ирина Фирсовна':
                Initials_senior_patroller = Initials_junior_patroller = 'Маркова И.Ф.';
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
                    Initials_senior_patroller, Initials_junior_patroller, Name_senior_patroller, 
                    Name_junior_patroller, Additional_order, Time_assignment_issue, Date_assignment_issue, 
                    Task_number, Date_issue_task, Patrol_date, Patrol_route_number, What_date_was_approved, 
                    Year_patrol, Year_patrol, Person_issued_task, Position_senior_patroller, Position_junior_patroller
                });

                // Генерация и сохранение нового документа
                const out = doc.getZip().generate({
                    type: "blob",
                    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                });

                // Создание элемента ссылки для скачивания файла
                const link = document.createElement('a');
                link.href = URL.createObjectURL(out);
                link.download = 'Задание 111.docx';
                link.click();

                output.textContent = `Готово!`;
            })
            .catch(error => {
                console.error('Ошибка:', error);
                alert('Не удалось загрузить файл!');
            });
    });
});