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
    this.tooltip = this.inputTooltipElement.tooltipEmptyElement;
    this.tooltipExists = this.inputTooltipElement.tooltipExistElement;

    this.pinnedTasksElement = new PinnedTasks();
    this.pinnedTasks = this.pinnedTasksElement.element;
    this.noPinnedTasks = this.pinnedTasksElement.noPinnedTasksElement;

    this.allTasksElement = new AllTasks();
    this.allTasks = this.allTasksElement.element;
    this.noTasks = this.allTasksElement.noTasksElement;

    this.tasksList = []; // массив введенных пользователем задач
    this.allTasksList = []; // массив не закрепленных задач
    this.pinnedTasksList = []; // массив закрепленных задач

    this.init();
  }

  init() {
    this.render();
    this.input.addEventListener('input', this.onInput.bind(this));
    this.input.addEventListener('change', this.onChange.bind(this));
  }

  // отрисовка первоначального состояния трекера:
  render() {
    this.tasks.append(this.mainTitle);
    this.tasks.append(this.inputTooltip);
    this.tasks.append(this.pinnedTasks);
    this.tasks.append(this.allTasks);
  }

  onInput() {
    this.tooltip.classList.add('hidden');
    this.tooltipExists.classList.add('hidden');
    this.taskText = this.input.value.trim().toLowerCase(); // содержимое input-а
  }

  onChange() {
    if (!this.taskText) {
      this.tooltip.classList.remove('hidden');
      this.resetInput();
      return;
    }

    // проверка наличия в списке заметок элемента с ключом введенного текста:
    if (!this.tasksList.find((item) => item[this.taskText])) {
      this.addTask();
    } else {
      this.tooltipExists.classList.remove('hidden');
    }

    this.resetInput();
  }

  resetInput() {
    this.input.value = '';
  }

  addTask() {
    const currentTask = this.createNewTask(this.taskText);
    this.tasksList.push({ [this.taskText]: currentTask }); // {текст заметки: заметка}
    this.allTasksList.push({ [this.taskText]: currentTask });
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

    taskElement.append(taskText, taskBtn);

    taskBtn.addEventListener('click', this.onClick.bind(this));
    return taskElement;
  }

  onClick(event) {
    const task = event.target.closest('.task'); // заметка, которую перемещаем в pinned
    this.pinnedTasksList.push(...this.allTasksList.splice(task, 1)); // массив pinned заметок
    this.pinTask(task.textContent);
    task.remove();
    if (!this.allTasksList.length) {
      this.noTasks.classList.remove('hidden');
    }
  }

  // <div class="task task_pinned">
  //   <div class="task__text">Task Name</div>
  //   <div class="task__btn">
  //     <div class="task__btn_pin">v</div>
  //   </div>
  // </div>
  pinTask(text) {
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

    taskBtn.append(taskBtnPin);

    pinnedElement.append(taskText, taskBtn);

    this.pinnedTasks.append(pinnedElement);

    this.noPinnedTasks.classList.add('hidden');

    taskBtnPin.addEventListener('click', this.onClickPin.bind(this));
  }

  onClickPin(event) {
    const task = event.target.closest('.task'); // заметка, которую убираем из pinned
    this.allTasksList.push(...this.pinnedTasksList.splice(task, 1)); // массив all заметок
    const currentTask = this.createNewTask(task.textContent.slice(0, -1));
    this.allTasks.append(currentTask);
    this.noTasks.classList.add('hidden');
    task.remove();

    if (!this.pinnedTasksList.length) {
      this.noPinnedTasks.classList.remove('hidden');
    }
  }
}
