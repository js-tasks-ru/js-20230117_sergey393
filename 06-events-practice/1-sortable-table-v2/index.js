import {stringComparator} from './utils/comparators/string.comparator.js';
import {numberComparator} from './utils/comparators/number.comparator.js';

export default class SortableTable {
  element;
  header;
  body;

  sorted;

  constructor(headersConfig, {
    data = [],
    sorted = {}
  } = {},
  isSortLocally = true
  ) {
    this.createElements();
    this.headerConfig = headersConfig;
    this.data = data;
    this.sorted = sorted;
    this.isSortLocally = isSortLocally;

    this.sortTypeMap = headersConfig.reduce((acc, field) => ({ ...acc, [field.id]: field.sortType }), {});
    this.sort(sorted.id, sorted.order);

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

    this.header.addEventListener('pointerdown', this.onClick);

    return this.header;
  }

  getColumnOrder(columnId) {
    if (this.sorted.id === columnId) {
      return this.sorted.order;
    }

    return '';
  }

  renderHeader() {
    this.header.innerHTML = this.headerConfig.map((column) => `
      <div class="sortable-table__cell" data-id="${column.id}" data-sortable="${column.sortable}" data-order="${this.getColumnOrder(column.id)}">
        <span>${column.title}</span>
        <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>
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

  createElements() {
    this.createHeader();
    this.createBody();
  }

  render() {
    const table = document.createElement('div');
    table.classList.add('sortable-table');

    this.renderHeader();
    this.renderBody();

    table.append(this.header);
    table.append(this.body);

    this.element = table;
  }

  sortOnClient(fieldValue, orderValue, customComparator = null) {
    if (!['asc', 'desc'].includes(orderValue)) {
      throw new Error("Bad param");
    }

    let comparator = customComparator;
    if (!comparator) {
      comparator = this.sortTypeMap[fieldValue] === 'number' ? numberComparator(orderValue) : stringComparator(orderValue);
    }

    this.sorted.order = orderValue;
    this.sorted.id = fieldValue;
    this.data.sort((objA, objB) => comparator(objA[fieldValue], objB[fieldValue]));

    this.renderHeader();
    this.renderBody();
  }

  sortOnServer(fieldValue, orderValue, customComparator = null) {
    return this.sortOnClient(fieldValue, orderValue, customComparator);
  }

  sort(fieldValue, orderValue) {
    if (this.isSortLocally) {
      this.sortOnClient(fieldValue, orderValue);
    } else {
      this.sortOnServer(fieldValue, orderValue);
    }
  }

  onClick = (event) => {
    const headerElement = event.target.closest(".sortable-table__cell");
    if (!headerElement || headerElement.dataset.sortable === "false") {
      return;
    }
    if (this.sorted.id === headerElement.dataset.id) {
      this.orderValue = this.orderValue === "desc" ? "asc" : "desc";
    } else {
      this.orderValue = "desc";
    }

    this.sort(headerElement.dataset.id, this.orderValue);
  };

  destroy() {
    this.element.remove();
  }

  remove() {
    this.element.remove();
  }
}

