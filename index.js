document.addEventListener("DOMContentLoaded", () => {
    const output = document.getElementById("output");

    document.getElementById('generate').addEventListener('click', (e) => {
        e.preventDefault();

        // Получение данных из формы
        const user_name = document.getElementById("user_name").value;
        const user_surname = document.getElementById("user_surname").value;

        // Загрузка заранее определенного файла, лежащего в той же директории
        fetch('input.docx')
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
                    user_name: user_name,
                    user_surname: user_surname,
                });

                // Генерация и сохранение нового документа
                const out = doc.getZip().generate({
                    type: "blob",
                    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                });

                // Создание элемента ссылки для скачивания файла
                const link = document.createElement('a');
                link.href = URL.createObjectURL(out);
                link.download = 'output.docx';
                link.click();

                output.textContent = `Готово!`;
            })
            .catch(error => {
                console.error('Ошибка:', error);
                alert('Не удалось загрузить файл!');
            });
    });
});