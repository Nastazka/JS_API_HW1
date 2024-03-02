// Необходимо создать веб-страницу с динамическими элементами с расписанием занятий.

// На странице должна быть таблица с расписанием занятий, на основе JSON-данных.
// Каждая строка таблицы должна содержать информацию о занятии, а именно:
// - название занятия
// - время проведения занятия
// - максимальное количество участников
// - текущее количество участников
// - кнопка "записаться"
// - кнопка "отменить запись"

// Если максимальное количество участников достигнуто, либо пользователь уже записан на занятие, сделайте кнопку "записаться" неактивной.
// Кнопка "отменить запись" активна в случае, если пользователь записан на занятие, иначе она должна быть неактивна.

// Пользователь может записаться на один курс только один раз.

// При нажатии на кнопку "записаться" увеличьте количество записанных участников.
// Если пользователь нажимает "отменить запись", уменьшите количество записанных участников.
// Обновляйте состояние кнопок и количество участников в реальном времени.

// Если количество участников уже максимально, то пользователь не может записаться, даже если он не записывался ранее.

// Сохраняйте данные в LocalStorage, чтобы они сохранялись и отображались при перезагрузке страницы.

const initialJson = '[{"id":1,"name":"Йога","time":"10:00 - 11:00","maxParticipants":15,"currentParticipants":8,"registeredUsers":["100","101","102","103","104","105","106","107"]},{"id":2,"name":"Пилатес","time":"11:30 - 12:30","maxParticipants":10,"currentParticipants":5,"registeredUsers":["100","101","102","103","104"]},{"id":3,"name":"Кроссфит","time":"13:00 - 14:00","maxParticipants":20,"currentParticipants":15,"registeredUsers":["100","101","102","103","104","105","106","107","108","109","110","111","112","113","114"]},{"id":4,"name":"Танцы","time":"14:30 - 15:30","maxParticipants":12,"currentParticipants":10,"registeredUsers":["100","101","102","103","104","105","106","107","108","109"]},{"id":5,"name":"Бокс","time":"16:00 - 17:00","maxParticipants":8,"currentParticipants":8,"registeredUsers":["100","101","102","103","104","105","106"]}]';

const lsKey = 'lessons';

if (!localStorage.getItem(lsKey)) {
    localStorage.setItem(lsKey, initialJson);
}

const lessons = JSON.parse(localStorage.getItem(lsKey));
const table = document.querySelector('.table');


table.innerHTML = lessons.map(createLessonsTable).join('');

function createLessonsTable(lesson) {
    return`
    <div id="${lesson.id}" class="card">
        <h2 class="lesson-name">${lesson.name}</h2>
        <p class="lesson-time">${lesson.time}</p>
        <p class="participants">Количество участников: <span id="current">${lesson.currentParticipants}</span>/<span id="max">${lesson.maxParticipants}</span></p>
        <button class="join">Записаться</button>
        <button class="leave">Отменить запись</button>
    </div>
    `
};

const userId = document.querySelector('.user-id').textContent;

table.addEventListener('click', ({target}) => {
    if (target.closest('.join')) {
        const cardItem = target.closest('.card');
        const lesson = lessons.find(lesson => lesson.id === +cardItem.getAttribute('id'));

        if (lesson.registeredUsers.includes(userId)) {
            target.closest('.join').disabled = true;
            alert('Вы уже зарегистрировались на это занятие!');
            return;
        }

        if (lesson.currentParticipants < lesson.maxParticipants) {
            lesson.currentParticipants++;
            lesson.registeredUsers.push(userId);
            localStorage.setItem(lsKey, JSON.stringify(lessons));

            cardItem.querySelector('#current').textContent = lesson.currentParticipants;
        
            if (lesson.currentParticipants >= lesson.maxParticipants) {
                target.closest('.join').disabled = true;
            }
        } else {
            target.closest('.join').disabled = true;
            alert('Уже достигнуто максимальное количество участников!');
        } 
    }
});

table.addEventListener('click', ({target}) => {
    if (target.closest('.leave')) {
        const cardItem = target.closest('.card');
        const lesson = lessons.find(lesson => lesson.id === +cardItem.getAttribute('id'));
        
        if (lesson.registeredUsers.includes(userId)) {
            
            lesson.registeredUsers.splice(lesson.registeredUsers.indexOf(userId), 1);
            localStorage.setItem(lsKey, JSON.stringify(lessons));
            lesson.currentParticipants--;
            lesson.registeredUsers = lesson.registeredUsers.filter(user => user!== userId);
            localStorage.setItem(lsKey, JSON.stringify(lessons));

            cardItem.querySelector('#current').textContent = lesson.currentParticipants;
        
            if (lesson.currentParticipants === 0) {
            target.closest('.leave').disabled = true;
            }

        } else {
            target.closest('.leave').disabled = true;
            alert('Вы не зарегистрировались на этот занятие!');
        }
        
    }
});

//Проблемы:
//- при обновлении страницы кнопки, которые были неактивными, становятся активными. Это попыталась обойти через алерт.
//- кнопка отменить запись становится неактивной, если мы не записались на занятие, но после нажатия на записаться она не становится активной, пока не обновим страницу.