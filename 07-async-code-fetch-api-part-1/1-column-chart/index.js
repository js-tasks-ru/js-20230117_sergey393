import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

const fetchFromBackend = (url, params) => fetchJson(`${BACKEND_URL}/${url}`, params);

export default class ColumnChart {
  element;
  subElements = {};
  chartHeight = 50;

  constructor({
    url,
    range,
    label,
    link,
    formatHeading = val => val
  } = {}) {
    this.url = url;
    this.range = range;
    this.label = label;
    this.link = link;
    this.formatHeading = formatHeading;

    if (range) {
      this.update(this.range.from, this.range.to);
    }

    this.render();
  }

  getColumnBody(data) {
    if (!data) {
      return;
    }
    const maxValue = Math.max(...data);
    const scale = this.chartHeight / maxValue;

    return data
      .map(item => {
        const percent = (item / maxValue * 100).toFixed(0);

        return `<div style="--value: ${Math.floor(item * scale)}" data-tooltip="${percent}%"></div>`;
      })
      .join('');
  }

  getLink() {
    return this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : '';
  }

  get template() {
    return `
      <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          Total ${this.label}
          ${this.getLink()}
        </div>
        <div class="column-chart__container">
           <div data-element="header" class="column-chart__header">
             ${this.formatHeading(this.value)}
           </div>
          <div data-element="body" class="column-chart__chart">
            ${this.getColumnBody(this.data)}
          </div>
        </div>
      </div>
    `;
  }

  render() {
    const element = document.createElement('div');

    element.innerHTML = this.template;

    this.element = element.firstElementChild;

    if (this.data && this.data.length) {
      this.element.classList.remove('column-chart_loading');
    }

    this.subElements = this.getSubElements(this.element);
  }

  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    return result;
  }

  async update(dateStart, dateEnd) {
    const result = await fetchFromBackend(this.url + '?' + new URLSearchParams({
      from: dateStart.toISOString(),
      to: dateEnd.toISOString(),
    }));

    this.data = [...Object.values(result)];
    this.subElements.body.innerHTML = this.getColumnBody(this.data);
    this.subElements.header.innerHTML = this.formatHeading(this.data.reduce((acc, val) => acc + val, 0));
    this.element.classList.remove('column-chart_loading');

    return result;
  }

  remove () {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}
