import { Title, Container } from "./components";

export default class ColumnChart {
  static chartHeight = 50;
  chartHeight = ColumnChart.chartHeight;

  element;

  data = [];
  label;
  value;
  link;
  formatHeading;

  constructor({ data, label, value, link, formatHeading } = {}) {
    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;
    this.formatHeading = formatHeading;

    this.update();
  }

  update(data) {
    if (data) {
      this.data = data;
    }
    this.render();
  }

  render() {
    const element = document.createElement('div');
    element.classList.add('column-chart');
    if (!this.data) {
      element.classList.add('column-chart_loading');
    }
    element.style.setProperty('--chart-height', ColumnChart.chartHeight.toString());

    element.append(new Title({ title: this.label, link: this.link }).element);
    element.append(new Container({
      header: this.value,
      formatHeading: this.formatHeading,
      data: this.data,
      maxHeight: this.chartHeight
    }).element);

    this.element = element;
  }

  destroy() {
    this.element = null;
  }
  remove() {
    this.element.remove();
  }
}
