export default class MainTitle {
  // <h1 class="main-title">Task tracker</h1>
  constructor() {
    this.element = document.createElement('h1');
    this.element.classList.add('main-title');
    this.element.textContent = 'Task tracker';
  }
}
