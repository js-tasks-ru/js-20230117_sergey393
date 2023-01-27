import { Chart } from "./chart";
import { Header } from "./header";

export class Container {
  element;

  data = [];
  header;
  formatHeading;
  maxHeight;

  constructor({ data, header, formatHeading, maxHeight }) {
    this.data = data;
    this.header = header;
    this.formatHeading = formatHeading;
    this.maxHeight = maxHeight;

    this.update({});
  }

  update({ data, header, maxHeight }) {
    if (data) {
      this.data = data;
    }
    if (header) {
      this.header = header;
    }
    if (maxHeight) {
      this.maxHeight = maxHeight;
    }
    this.render();
  }

  render() {
    const element = document.createElement('div');
    element.classList.add('column-chart__container');

    element.append(new Header({header: this.header, formatHeading: this.formatHeading}).element);
    if (this.data) {
      element.append(new Chart({data: this.data, maxHeight: this.maxHeight}).element);
    }

    this.element = element;
  }
}
