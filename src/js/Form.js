export default class Form {
  // <form class="form">
  //   <input class="tasks__input" type="text" placeholder="Введите задачу">
  //   <div class="tooltip hidden">Поле не должно быть пустым!</div>
  //   <div class="tooltip hidden">Заметка уже существует!</div>
  // </form>
  constructor() {
    this.element = document.createElement('form');
    this.element.classList.add('form');

    this.tasksInputElement = document.createElement('input');
    this.tasksInputElement.classList.add('tasks__input');
    this.tasksInputElement.type = 'text';
    this.tasksInputElement.placeholder = 'Введите задачу';

    this.tooltipEmptyElement = document.createElement('div');
    this.tooltipEmptyElement.classList.add('tooltip', 'hidden');
    this.tooltipEmptyElement.textContent = 'Поле не должно быть пустым!';

    this.tooltipExistElement = document.createElement('div');
    this.tooltipExistElement.classList.add('tooltip', 'hidden');
    this.tooltipExistElement.textContent = 'Заметка уже существует!';

    this.element.append(this.tasksInputElement, this.tooltipEmptyElement, this.tooltipExistElement);
  }
}
