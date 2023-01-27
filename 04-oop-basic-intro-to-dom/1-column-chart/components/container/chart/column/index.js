export class Column {
  element;

  value;
  percent;

  constructor({ value, percent }) {
    this.value = value;
    this.percent = percent;

    this.update({});
  }

  update({ value, percent }) {
    if (value) {
      this.value = value;
    }
    if (percent) {
      this.percent = percent;
    }
    this.render();
  }

  render() {
    const element = document.createElement('div');
    element.style.setProperty('--value', this.value);
    element.setAttribute('data-tooltip', this.percent);

    this.element = element;
  }
}
