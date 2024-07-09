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
    this.tooltip = this.inputTooltipElement.tooltipElement;

    this.pinnedTasksElement = new PinnedTasks();
    this.pinnedTasks = this.pinnedTasksElement.element;
    this.noPinnedTasks = this.pinnedTasksElement.noPinnedTasksElement;

    this.allTasksElement = new AllTasks();
    this.allTasks = this.allTasksElement.element;
    this.noTasks = this.allTasksElement.noTasksElement;

    this.tasksList = []; // массив введенных пользователем задач

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
    this.taskText = this.input.value.trim().toLowerCase(); // содержимое input-а
  }

  onChange() {
    if (!this.taskText) {
      this.tooltip.classList.remove('hidden');
      this.resetInput();
      return;
    }

    if (!this.tasksList.includes(this.taskText)) {
      this.addTask();
    } else {
      console.log('заметка уже существует!'); // TODO: сделать новую подсказку!!!
    }

    this.resetInput();
  }

  resetInput() {
    this.input.value = '';
  }

  addTask() {
    this.tasksList.push(this.taskText);
    const html = `
      <div class="task">
        <div class="task__text">${this.taskText}</div>
        <div class="task__btn"></div>
      </div>
    `;
    this.allTasks.insertAdjacentHTML('beforeend', html);
    this.noTasks.classList.add('hidden');
  }
}
