import { Column } from "./column";
import ColumnChart from "../../../index.js";

export class Chart {
  element;

  data = [];
  maxHeight = 100;

  constructor({ data, maxHeight }) {
    this.maxHeight = maxHeight;
    this.data = this.prepareData(data);

    this.update({});
  }

  getColumnProps(data) {
    const maxValue = Math.max(...data);
    const scale = ColumnChart.chartHeight / maxValue;

    return data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });
  }

  prepareData(data) {
    return this.getColumnProps(data);
  }

  update({ data, maxHeight }) {
    if (data) {
      this.data = this.prepareData(data);
    }
    if (maxHeight) {
      this.maxHeight = maxHeight;
    }
    this.render();
  }

  render() {
    const element = document.createElement('div');
    element.classList.add('column-chart__chart');
    element.setAttribute('data-element', 'body');

    element.append(...this.getColumnNodes());

    this.element = element;
  }

  getColumnNodes() {
    return this.data.map(({ percent, value }) => new Column({ value: value, percent: percent }).element);
  }
}
