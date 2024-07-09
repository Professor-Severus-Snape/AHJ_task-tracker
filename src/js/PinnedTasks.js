export default class PinnedTasks {
  // <div class="pinned-tasks">
  //   <h2 class="title">Pinned:</h2>
  //   <div class="pinned-tasks__none">No pinned tasks</div> || <div class="pinned-tasks__none hidden">No pinned tasks</div>
  // </div>
  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('pinned-tasks');

    this.titleElement = document.createElement('h2');
    this.titleElement.classList.add('title');
    this.titleElement.textContent = 'Pinned:';

    this.noPinnedTasksElement = document.createElement('div');
    this.noPinnedTasksElement.classList.add('pinned-tasks__none');
    this.noPinnedTasksElement.textContent = 'No pinned tasks';

    this.element.append(this.titleElement, this.noPinnedTasksElement);
  }
}
