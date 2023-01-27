export default class Header {
  element;

  header;
  formatHeading;

  constructor({ header, formatHeading }) {
    this.header = header;
    this.formatHeading = formatHeading;

    this.update({});
  }

  update({ header }) {
    if (header) {
      this.header = header;
    }
    this.render();
  }

  render() {
    const element = document.createElement('div');
    element.classList.add('column-chart__header');
    element.setAttribute('data-element', 'header');
    element.innerHTML = typeof this.formatHeading === 'function' ? this.formatHeading(this.header) : this.header;

    this.element = element;
  }
}
