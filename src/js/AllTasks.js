export default class AllTasks {
  // <div class="all-tasks">
  //   <h2 class="title">All Tasks:</h2>
  //   <div class="all-tasks__none">No tasks found</div>
  // </div>
  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('all-tasks');

    this.titleElement = document.createElement('h2');
    this.titleElement.classList.add('title');
    this.titleElement.textContent = 'All Tasks:';

    this.noTasksElement = document.createElement('div');
    this.noTasksElement.classList.add('all-tasks__none');
    this.noTasksElement.textContent = 'No tasks found';

    this.element.append(this.titleElement, this.noTasksElement);
  }
}
