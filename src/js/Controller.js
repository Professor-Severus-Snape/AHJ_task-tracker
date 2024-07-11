import Copyrights from './Copyrights';
import Tasks from './Tasks';
import MainTitle from './MainTitle';
import Form from './Form';
import PinnedTasks from './PinnedTasks';
import AllTasks from './AllTasks';

export default class Controller {
  constructor() {
    this.container = document.querySelector('.container');

    this.tasks = new Tasks().element;

    this.mainTitle = new MainTitle().element;

    this.inputTooltipElement = new Form();
    this.form = this.inputTooltipElement.element;
    this.input = this.inputTooltipElement.tasksInputElement;
    this.tooltipEmpty = this.inputTooltipElement.tooltipEmptyElement;
    this.tooltipExists = this.inputTooltipElement.tooltipExistElement;

    this.pinnedTasksElement = new PinnedTasks();
    this.pinnedTasks = this.pinnedTasksElement.element;
    this.noPinnedTasks = this.pinnedTasksElement.noPinnedTasksElement;

    this.allTasksElement = new AllTasks();
    this.allTasks = this.allTasksElement.element;
    this.noTasks = this.allTasksElement.noTasksElement;

    this.tasksList = []; // [{ текст заметки: заметка из раздела All Tasks }, ...]
    this.allTasksList = []; // ['текст заметки из раздела All Tasks', ...]
    this.pinnedTasksList = []; // ['текст заметки из раздела Pinned Tasks', ...]

    this.copyrights = new Copyrights().element;

    this.init();
  }

  init() {
    this.render();
    this.checkRights();
    this.form.addEventListener('submit', this.onFormSubmit.bind(this));
    this.input.addEventListener('input', this.onInput.bind(this));
    this.onClickHandler = this.onClick.bind(this);
    this.onClickPinHandler = this.onClickPin.bind(this);
    this.onClickRemoveHandler = this.onClickRemove.bind(this);
    this.onClickRemovePinHandler = this.onClickRemovePin.bind(this);
  }

  // отрисовка первоначального состояния трекера:
  render() {
    this.container.append(this.tasks);
    this.container.append(this.copyrights);
    this.tasks.append(this.mainTitle);
    this.tasks.append(this.form);
    this.tasks.append(this.pinnedTasks);
    this.tasks.append(this.allTasks);
  }

  checkRights() {
    if (this.copyrights.textContent !== '© Professor-Severus-Snape, 2024') {
      Copyrights.stoleRights();
    }
  }

  resetInput() {
    this.input.value = '';
  }

  hideTooltips() {
    this.tooltipEmpty.classList.add('hidden');
    this.tooltipExists.classList.add('hidden');
  }

  // если на момент события в поле был текст, то чистим поле и убираем подсказки:
  clean() {
    this.resetInput();
    this.hideTooltips();
  }

  addNewTask(text) {
    const currentTask = this.createNewTask(text);
    this.tasksList.push({ [text]: currentTask });
    this.allTasksList.push(text);
    this.allTasks.append(currentTask);
    this.noTasks.classList.add('hidden');
  }

  // <div class="task">
  //   <div class="task__text">Task Name</div>
  //   <div class="task__btn"></div>
  //   <div class="task__remove-btn">
  //     <div class="task__remove-btn_pin">x</div>
  //   </div>
  // </div>
  createNewTask(text) {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task');

    const taskText = document.createElement('div');
    taskText.classList.add('task__text');
    taskText.textContent = text;

    const taskBtn = document.createElement('div');
    taskBtn.classList.add('task__btn');
    taskBtn.addEventListener('click', this.onClickHandler);

    const taskRemoveBtn = document.createElement('div');
    taskRemoveBtn.classList.add('task__remove-btn');

    const taskRemoveBtnPin = document.createElement('div');
    taskRemoveBtnPin.classList.add('task__remove-btn_pin');
    taskRemoveBtnPin.textContent = 'x';
    taskRemoveBtnPin.addEventListener('click', this.onClickRemoveHandler);

    taskRemoveBtn.append(taskRemoveBtnPin);

    taskElement.append(taskText, taskBtn, taskRemoveBtn);
    return taskElement;
  }

  addPinnedTask(text) {
    const pinnedTask = this.createPinnedTask(text);
    this.pinnedTasks.append(pinnedTask);
    this.noPinnedTasks.classList.add('hidden');
  }

  // <div class="task task_pinned">
  //   <div class="task__text">Task Name</div>
  //   <div class="task__btn">
  //     <div class="task__btn_pin">v</div>
  //   </div>
  //   <div class="task__remove-btn">
  //     <div class="task__remove-btn_pin">x</div>
  //   </div>
  // </div>
  createPinnedTask(text) {
    const pinnedElement = document.createElement('div');
    pinnedElement.classList.add('task', 'task_pinned');

    const taskText = document.createElement('div');
    taskText.classList.add('task__text');
    taskText.textContent = text;

    const taskBtn = document.createElement('div');
    taskBtn.classList.add('task__btn');

    const taskBtnPin = document.createElement('div');
    taskBtnPin.classList.add('task__btn_pin');
    taskBtnPin.textContent = 'v';
    taskBtnPin.addEventListener('click', this.onClickPinHandler);

    taskBtn.append(taskBtnPin);

    const taskRemoveBtn = document.createElement('div');
    taskRemoveBtn.classList.add('task__remove-btn');

    const taskRemoveBtnPin = document.createElement('div');
    taskRemoveBtnPin.classList.add('task__remove-btn_pin');
    taskRemoveBtnPin.textContent = 'x';
    taskRemoveBtnPin.addEventListener('click', this.onClickRemovePinHandler);

    taskRemoveBtn.append(taskRemoveBtnPin);

    pinnedElement.append(taskText, taskBtn, taskRemoveBtn);
    return pinnedElement;
  }

  sort() {
    this.showTasks();

    const filterList = this.allTasksList.filter((str) => str.startsWith(this.taskText));

    // this.tasksList = [ { текст заметки: заметка }, { текст заметки: заметка } ... ]
    this.tasksList.forEach((obj) => {
      Object.entries(obj).forEach(([key, value]) => {
        if (!filterList.includes(key)) {
          value.classList.add('hidden');
          if (!filterList.length) {
            this.noTasks.classList.remove('hidden');
          } else {
            this.noTasks.classList.add('hidden');
          }
        }
      });
    });
  }

  showTasks() {
    if (!this.allTasksList.length) {
      this.noTasks.classList.remove('hidden');
      return;
    }

    this.noTasks.classList.add('hidden');

    // this.tasksList = [ { текст заметки: заметка }, { текст заметки: заметка } ... ]
    this.tasksList.forEach((obj) => {
      Object.entries(obj).forEach(([key, value]) => {
        this.allTasksList.forEach((text) => {
          if (text === key) {
            value.classList.remove('hidden');
          }
        });
      });
    });
  }

  onInput() {
    this.hideTooltips();

    this.taskText = this.input.value.trim().toLowerCase(); // содержимое input-а

    if (!this.taskText) {
      this.showTasks();
      return;
    }

    this.sort();
  }

  onFormSubmit(event) {
    event.preventDefault();

    this.clean();
    this.showTasks();

    if (!this.taskText) {
      this.tooltipEmpty.classList.remove('hidden');
      return;
    }

    // проверка наличия в списках элемента с введенным текстом:
    if (!this.allTasksList.includes(this.taskText)
      && !this.pinnedTasksList.includes(this.taskText)) {
      this.addNewTask(this.taskText);
    } else {
      this.tooltipExists.classList.remove('hidden');
    }
  }

  onClick(event) {
    this.clean();

    const task = event.target.closest('.task');
    const text = task.textContent.slice(0, -1);
    const allTaskIndex = this.allTasksList.findIndex((str) => str === text);

    // 1. перемещаем строку из this.allTasksList в this.pinnedTasksList:
    this.pinnedTasksList.push(...this.allTasksList.splice(allTaskIndex, 1));

    // 2. удаляем объект вида { текст заметки: заметка } из общего массива this.tasksList:
    const taskIndex = this.tasksList.findIndex((obj) => Object.keys(obj).includes(text));
    this.tasksList.splice(taskIndex, 1);

    // 3. создаем узел в DOM (в разделе Pinned Tasks):
    this.addPinnedTask(text);

    // 4. удаляем обработчик:
    const taskBtn = task.querySelector('.task__btn');
    taskBtn.removeEventListener('click', this.onClickHandler);

    // 5. удаляем узел из DOM (из раздела All Tasks):
    task.remove();

    if (!this.allTasksList.length) {
      this.noTasks.classList.remove('hidden');
    }

    // 5. снимаем фильтр:
    this.showTasks();
  }

  onClickPin(event) {
    this.clean();

    const task = event.target.closest('.task');
    const text = task.textContent.slice(0, -2);
    const taskIndex = this.pinnedTasksList.findIndex((str) => str === text);

    // 1. удаляем строки из this.pinnedTasksList:
    this.pinnedTasksList.splice(taskIndex, 1);

    // 2. создаем узел в DOM (раздел All Tasks) и строку в this.allTasksList:
    this.addNewTask(text);

    // 3. удаляем обработчик:
    const taskBtnPin = task.querySelector('.task__btn_pin');
    taskBtnPin.removeEventListener('click', this.onClickPinHandler);

    // 4. удаляем сам узел из DOM (из раздела Pinned Tasks):
    task.remove();

    if (!this.pinnedTasksList.length) {
      this.noPinnedTasks.classList.remove('hidden');
    }

    // 5. снимаем фильтр:
    this.showTasks();
  }

  onClickRemove(event) {
    this.clean();

    const task = event.target.closest('.task');
    const text = task.textContent.slice(0, -1);
    const allTaskIndex = this.allTasksList.findIndex((str) => str === text);

    // 1. удаляем строку из this.allTasksList:
    this.allTasksList.splice(allTaskIndex, 1);

    // 2. удаляем объект вида { текст заметки: заметка } из общего массива this.tasksList:
    const taskIndex = this.tasksList.findIndex((obj) => Object.keys(obj).includes(text));
    this.tasksList.splice(taskIndex, 1);

    // 3. удаляем обработчик:
    const taskRemoveBtnPin = task.querySelector('.task__remove-btn_pin');
    taskRemoveBtnPin.removeEventListener('click', this.onClickRemoveHandler);

    // 4. удаляем сам узел из DOM (из раздела Pinned Tasks):
    task.remove();

    if (!this.allTasksList.length) {
      this.noTasks.classList.remove('hidden');
    }

    // 5. снимаем фильтр:
    this.showTasks();
  }

  onClickRemovePin(event) {
    this.clean();

    const task = event.target.closest('.task');
    const text = task.textContent.slice(0, -2);
    const pinnedTaskIndex = this.pinnedTasksList.findIndex((str) => str === text);

    // 1. удаляем строку из this.pinnedTasksList:
    this.pinnedTasksList.splice(pinnedTaskIndex, 1);

    // 2. удаляем обработчик:
    const taskRemoveBtnPin = task.querySelector('.task__remove-btn_pin');
    taskRemoveBtnPin.removeEventListener('click', this.onClickRemovePinHandler);

    // 3. удаляем сам узел из DOM (из раздела Pinned Tasks):
    task.remove();

    if (!this.pinnedTasksList.length) {
      this.noPinnedTasks.classList.remove('hidden');
    }

    // 4. снимаем фильтр:
    this.showTasks();
  }
}
