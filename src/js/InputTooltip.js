export default class InputTooltip {
  // <div class="input-tooltip">
  //   <input class="tasks__input" type="text" maxlength="30" placeholder="Введите задачу">
  //   <div class="tooltip hidden">Поле не должно быть пустым!</div>
  //   <div class="tooltip hidden">Заметка уже существует!</div>
  //   <div class="tooltip hidden">Это максимально допустимая длина!</div>
  // </div>
  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('input-tooltip');

    this.tasksInputElement = document.createElement('input');
    this.tasksInputElement.classList.add('tasks__input');
    this.tasksInputElement.type = 'text';
    // this.tasksInputElement.maxLength = '30'; // NOTE: вернуть после отладки
    this.tasksInputElement.maxLength = '3'; // NOTE: отладка !!!
    this.tasksInputElement.placeholder = 'Введите задачу';

    this.tooltipEmptyElement = document.createElement('div');
    this.tooltipEmptyElement.classList.add('tooltip', 'hidden');
    this.tooltipEmptyElement.textContent = 'Поле не должно быть пустым!';

    this.tooltipExistElement = document.createElement('div');
    this.tooltipExistElement.classList.add('tooltip', 'hidden');
    this.tooltipExistElement.textContent = 'Заметка уже существует!';

    this.tooltipLengthElement = document.createElement('div');
    this.tooltipLengthElement.classList.add('tooltip', 'hidden');
    this.tooltipLengthElement.textContent = 'Это максимальная длина!';

    this.element.append(
      this.tasksInputElement,
      this.tooltipEmptyElement,
      this.tooltipExistElement,
      this.tooltipLengthElement,
    );
  }
}
