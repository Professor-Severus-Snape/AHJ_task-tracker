import MainTitle from './MainTitle';
import InputTooltip from './InputTooltip';
import PinnedTasks from './PinnedTasks';
import AllTasks from './AllTasks';

export default class Controller {
  constructor() {
    this.container = document.querySelector('.container'); // NOTE: нужно ли динамическое создание ???
    this.tasks = document.querySelector('.tasks'); // NOTE: нужно ли динамическое создание ???

    this.mainTitle = new MainTitle().element;

    this.inputTooltipElement = new InputTooltip();
    this.inputTooltip = this.inputTooltipElement.element;
    this.input = this.inputTooltipElement.tasksInputElement;
    this.tooltipEmpty = this.inputTooltipElement.tooltipEmptyElement;
    this.tooltipExists = this.inputTooltipElement.tooltipExistElement;
    this.tooltipLength = this.inputTooltipElement.tooltipLengthElement;

    this.pinnedTasksElement = new PinnedTasks();
    this.pinnedTasks = this.pinnedTasksElement.element;
    this.noPinnedTasks = this.pinnedTasksElement.noPinnedTasksElement;

    this.allTasksElement = new AllTasks();
    this.allTasks = this.allTasksElement.element;
    this.noTasks = this.allTasksElement.noTasksElement;

    this.tasksList = []; // [{ текст заметки: заметка из раздела All Tasks }, ...]
    this.allTasksList = []; // ['текст заметки из раздела All Tasks', ...]
    this.pinnedTasksList = []; // ['текст заметки из раздела Pinned Tasks', ...]

    this.init();
  }

  init() {
    this.render();
    this.input.addEventListener('input', this.onInput.bind(this));
    this.input.addEventListener('keyup', this.onEnterKeyUp.bind(this));
    this.onClickHandler = this.onClick.bind(this);
    this.onClickPinHandler = this.onClickPin.bind(this);
  }

  // отрисовка первоначального состояния трекера:
  render() {
    this.tasks.append(this.mainTitle);
    this.tasks.append(this.inputTooltip);
    this.tasks.append(this.pinnedTasks);
    this.tasks.append(this.allTasks);
  }

  hideTooltips() {
    this.tooltipEmpty.classList.add('hidden');
    this.tooltipExists.classList.add('hidden');
    this.tooltipLength.classList.add('hidden');
  }

  onInput() {
    this.hideTooltips();

    this.taskText = this.input.value.trim().toLowerCase(); // содержимое input-а
    // if (this.input.value.length === 30) { // NOTE: вернуть после отладки
    if (this.input.value.length === 3) { // NOTE: отладка !!!
      this.tooltipLength.classList.remove('hidden');
    } else if (!this.taskText) {
      this.showTasks();
    }
    this.sort();
  }

  onEnterKeyUp(event) {
    if (event.code === 'Enter') {
      this.resetInput();
      this.hideTooltips();
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
  }

  resetInput() {
    this.input.value = '';
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

    taskElement.append(taskText, taskBtn);
    return taskElement;
  }

  onClick(event) {
    // если на момент клика в поле был текст, то чистим поле и убираем подсказки:
    if (this.input.value) {
      this.resetInput();
      this.hideTooltips();
    }

    const task = event.target.closest('.task');
    const text = task.textContent;
    const allTaskIndex = this.allTasksList.findIndex((str) => str === text);

    // 1. перемещаем строку из this.allTasksList в this.pinnedTasksList:
    this.pinnedTasksList.push(...this.allTasksList.splice(allTaskIndex, 1));

    // 2. удаляем объект вида { текст заметки: заметка } из общего массива this.tasksList:
    const taskIndex = this.tasksList.findIndex((obj) => Object.keys(obj).includes(text));

    this.tasksList.splice(taskIndex, 1);

    // 3. создаем узел в DOM (в разделе Pinned Tasks):
    this.addPinnedTask(task.textContent);

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

    pinnedElement.append(taskText, taskBtn);
    return pinnedElement;
  }

  onClickPin(event) {
    // если на момент клика в поле был текст, то чистим поле и убираем подсказки:
    if (this.input.value) {
      this.resetInput();
      this.hideTooltips();
    }

    const task = event.target.closest('.task');
    const text = task.textContent.slice(0, -1);
    const taskIndex = this.pinnedTasksList.findIndex((str) => str === text);

    // 1. Удаление строки из this.pinnedTasksList:
    this.pinnedTasksList.splice(taskIndex, 1);

    // 2. Создание узла в DOM (раздел All Tasks) и строки в this.allTasksList:
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
}
