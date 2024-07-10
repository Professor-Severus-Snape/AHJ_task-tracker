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

    this.tasksList = []; // массив введенных пользователем задач -> NOTE: массив объектов { текст заметки: заметка }
    this.allTasksList = []; // массив не закрепленных задач -> NOTE: массив строк!!!
    this.pinnedTasksList = []; // массив закрепленных задач -> NOTE: массив строк!!!

    this.init();
  }

  init() {
    this.render();
    this.input.addEventListener('input', this.onInput.bind(this));
    // this.input.addEventListener('change', this.onChange.bind(this)); // FIXME: что использовать - change или keyup ???
    this.input.addEventListener('keyup', this.onEnterKeyUp.bind(this)); // FIXME: что использовать - change или keyup ???
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
    console.warn('Событие input!!!'); // NOTE: отладка !!!

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

  // FIXME: кажется, что change хуже, чем keyup...
  // onChange() {
  //   console.warn('Событие change!!!'); // NOTE: отладка !!!

  //   this.resetInput();
  //   this.hideTooltips();
  //   this.showTasks();

  //   if (!this.taskText) {
  //     this.tooltipEmpty.classList.remove('hidden');
  //     return;
  //   }

  //   // проверка наличия в списке заметок элемента с ключом введенного текста:
  //   if (!this.tasksList.find((obj) => obj[this.taskText])) {
  //     this.addNewTask(); // FIXME: при любом клике в сторону добавляет ненужную заметку !!! 
  //   } else {
  //     this.tooltipExists.classList.remove('hidden');
  //   }
  // }

  // FIXME: кажется, что keyup лучше, чем change...
  onEnterKeyUp(event) {
    if(event.code === 'Enter') {
      console.warn('Событие keyup!!!'); // NOTE: отладка !!!

      this.resetInput();
      this.hideTooltips();
      this.showTasks();

      if (!this.taskText) {
        this.tooltipEmpty.classList.remove('hidden');
        return;
      }

      // проверка наличия в списке заметок элемента с ключом введенного текста:
      if (!this.tasksList.find((obj) => obj[this.taskText])) {
        this.addNewTask();
      } else {
        this.tooltipExists.classList.remove('hidden');
      }
    }
  }

  resetInput() {
    this.input.value = '';
  }

  addNewTask() {
    const currentTask = this.createNewTask(this.taskText);
    this.tasksList.push({ [this.taskText]: currentTask }); // {текст заметки: заметка}
    this.allTasksList.push(this.taskText); // массив строк (текст заметки) -> ['123', 'qwerty']
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
    taskBtn.addEventListener('click', this.onClick.bind(this));

    taskElement.append(taskText, taskBtn);
    return taskElement;
  }

  onClick(event) {
    console.warn('Событие click -> добавление заметки в pinned !!!'); // NOTE: отладка !!!

    // если на момент клика в поле был текст, то чистим поле и убираем подсказки:
    if (this.taskText) {
      console.log('клик по кнопке - чистим поле'); // NOTE: отладка !!!
      this.resetInput();
      this.hideTooltips(); // FIXME: как сделать, чтобы подсказка не мелькала ???
    }

    const task = event.target.closest('.task'); // заметка, которую перемещаем в pinned
    const taskIndex = this.allTasksList.findIndex((str) => str === task.textContent);

    // console.log('task: ', task); // NOTE: отладка !!!
    // console.log('task.textContent: ', task.textContent); // NOTE: отладка !!!
    // console.log('taskIndex: ', taskIndex); // NOTE: отладка !!!

    // console.log('До переноса -> this.pinnedTasksList: ', this.pinnedTasksList); // NOTE: отладка !!!
    // console.log('До переноса -> this.allTasksList: ', this.allTasksList); // NOTE: отладка !!!

    this.pinnedTasksList.push(...this.allTasksList.splice(taskIndex, 1)); // массив строк (текст заметки) -> ['123', 'qwerty']

    // console.log('После переноса -> this.pinnedTasksList: ', this.pinnedTasksList); // NOTE: отладка !!!
    // console.log('После переноса -> this.allTasksList: ', this.allTasksList); // NOTE: отладка !!!

    // console.log('this.tasksList ДО: ', this.tasksList); // NOTE: отладка !!!
    task.remove(); // NB! удаляем заметку со страницы, но в this.tasksList она остается!
    // console.log('this.tasksList ПОСЛЕ: ', this.tasksList); // NOTE: отладка !!!

    if (!this.allTasksList.length) {
      this.noTasks.classList.remove('hidden');
    }

    this.addPinnedTask(task.textContent);
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
    taskBtnPin.addEventListener('click', this.onClickPin.bind(this));

    taskBtn.append(taskBtnPin);

    pinnedElement.append(taskText, taskBtn);
    return pinnedElement;
  }

  onClickPin(event) {
    console.warn('Событие click -> убираем заметку из pinned !!!'); // NOTE: отладка !!!

    // если на момент клика в поле был текст, то чистим поле и убираем подсказки:
    if (this.taskText) {
      console.log('клик по кнопке - чистим поле'); // NOTE: отладка !!!
      this.resetInput();
      this.hideTooltips(); // FIXME: как сделать, чтобы подсказка не мелькала ???
    }

    const task = event.target.closest('.task'); // заметка, которую убираем из pinned
    const taskIndex = this.pinnedTasksList.findIndex((str) => str === task.textContent.slice(0, -1));

    // console.log('кликнутая закрепленная задача: ', task); // NOTE: отладка !!!
    // console.log('текст кликнутой закрепленной задачи без "v": ', task.textContent.slice(0, -1)); // "123"  // NOTE: отладка !!!
    // console.log('индекс объекта с подходящим текстом: ', taskIndex); // NOTE: отладка !!!

    // console.log('До переноса -> this.pinnedTasksList: ', this.pinnedTasksList); // NOTE: отладка !!!
    // console.log('До переноса -> this.allTasksList: ', this.allTasksList); // NOTE: отладка !!!

    this.allTasksList.push(...this.pinnedTasksList.splice(taskIndex, 1)); // массив all заметок -  // { '123': <div class="task">...</div> }
 
    // console.log('После переноса -> this.pinnedTasksList: ', this.pinnedTasksList); // NOTE: отладка !!!
    // console.log('После переноса -> this.allTasksList: ', this.allTasksList); // NOTE: отладка !!!
    
    const currentTask = this.createNewTask(task.textContent.slice(0, -1));
    this.allTasks.append(currentTask);
    this.noTasks.classList.add('hidden');
    // console.log('this.tasksList ДО: ', this.tasksList); // NOTE: отладка !!!
    task.remove(); // NB! удаляем заметку со страницы, но в this.tasksList она остается!
    // console.log('this.tasksList ПОСЛЕ: ', this.tasksList); // NOTE: отладка !!!

    if (!this.pinnedTasksList.length) {
      this.noPinnedTasks.classList.remove('hidden');
    }
  }

  // FIXME: отмеченные прежде заметки подходят под любые параметры !!! Почему ???
  sort() {
    this.showTasks();

    const filterList = this.allTasksList.filter((str) => str.startsWith(this.taskText)); // массив подходящих заметок -> ['1', '12', '123']
    console.log('массив подходящих заметок (filterList): ', filterList);

    // this.tasksList = [ { текст заметки: заметка }, { текст заметки: заметка } ... ] 
    this.tasksList.forEach((obj) => {
      Object.entries(obj).forEach(([key, value]) => {
        if (!filterList.includes(key)) {
          console.log('не подходит: ', key);  // NOTE: отладка !!!
          value.classList.add('hidden'); // FIXME: не скрывает ранее отмеченные заметки !!!
          if (!filterList.length) {
            this.noTasks.classList.remove('hidden');
          } else {
            this.noTasks.classList.add('hidden');
          }
        } else {
          console.log('подходит: ', key); // NOTE: отладка !!!
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
        // this.allTasksList = [ 'текст заметки', 'текст заметки', ... ] 
        this.allTasksList.forEach((text) => {
          if (text === key) {
            value.classList.remove('hidden');
          }
        });
      });
    });
  }
}
