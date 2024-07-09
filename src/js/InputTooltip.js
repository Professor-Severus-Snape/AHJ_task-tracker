export default class InputTooltip {
  // <div class="input-tooltip">
  //   <input class="tasks__input" type="text" placeholder="Введите задачу">
  //   <div class="tooltip hidden">Поле не должно быть пустым!</div>
  // </div>
  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('input-tooltip');

    this.tasksInputElement = document.createElement('input');
    this.tasksInputElement.classList.add('tasks__input');
    this.tasksInputElement.type = 'text';
    this.tasksInputElement.placeholder = 'Введите задачу';

    this.tooltipElement = document.createElement('div');
    this.tooltipElement.classList.add('tooltip', 'hidden');
    this.tooltipElement.textContent = 'Поле не должно быть пустым!';

    this.element.append(this.tasksInputElement, this.tooltipElement);
  }
}
