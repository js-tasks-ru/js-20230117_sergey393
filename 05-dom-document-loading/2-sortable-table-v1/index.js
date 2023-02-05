import {stringComparator} from './utils/comparators/string.comparator.js';
import {numberComparator} from './utils/comparators/number.comparator.js';

export default class SortableTable {
  element;
  header;
  body;

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.sortTypeMap = headerConfig.reduce((acc, field) => ({ ...acc, [field.id]: field.sortType }), {});

    this.render();
  }


  get subElements() {
    return {
      header: this.header,
      body: this.body,
    };
  }

  createHeader() {
    if (!this.header) {
      const template = `<div data-element="header" class="sortable-table__header sortable-table__row"></div>`;
      this.header = this.getHTMLNode(template);
    }

    return this.header;
  }

  renderHeader() {
    this.header.innerHTML = this.headerConfig.map((column) => `
      <div class="sortable-table__cell" data-id="${column.id}" data-sortable="${column.sortable}">
        <span>${column.title}</span>
      </div>
    `).join("");

    return this.header;
  }

  createBody() {
    if (!this.body) {
      const template = `<div data-element="body" class="sortable-table__body"></div>`;
      this.body = this.getHTMLNode(template);
    }

    return this.body;
  }

  renderBody() {
    this.body.innerHTML = this.getDataRow().join("");

    return this.body;
  }

  getDataRow() {
    return this.data.map((row) => {
      return `<div class="sortable-table__row">${this.getDataRowCells(row)}</div>`;
    });
  }

  getDataRowCells(row) {
    return this.headerConfig.map((column) => {
      if (typeof column.template === 'function') {
        return column.template(row[column.id]);
      }

      return `<div class="sortable-table__cell">${row[column.id]}</div>`;
    }).join("");
  }

  getHTMLNode(html) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;

    return wrapper.firstElementChild;
  }

  render() {
    const table = document.createElement('div');
    table.classList.add('sortable-table');

    this.createHeader();
    this.createBody();
    this.renderHeader();
    this.renderBody();

    table.append(this.header);
    table.append(this.body);

    this.element = table;
  }

  sort(fieldValue, orderValue) {
    if (!['asc', 'desc'].includes(orderValue)) {
      throw new Error("Bad param");
    }

    const comparator = this.sortTypeMap[fieldValue] === 'number' ? numberComparator(orderValue) : stringComparator(orderValue);

    this.data.sort((objA, objB) => comparator(objA[fieldValue], objB[fieldValue]));

    this.renderBody();
  }


  destroy() {
    this.element.remove();
  }

  remove() {
    this.element.remove();
  }
}

