import fetchJson from './utils/fetch-json.js';
import {stringComparator} from './utils/comparators/string.comparator.js';
import {numberComparator} from './utils/comparators/number.comparator.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

const fetchFromBackend = (url, params) => fetchJson(`${BACKEND_URL}/${url}`, params);

export default class SortableTable {
  INF_SCROLL_STEP = 30;
  INF_SCROLL_ELEMENT = Math.ceil(this.INF_SCROLL_STEP / 5);

  scrollTriggerElement;
  isFetching = false;
  lastPage = false;

  element;
  header;
  body;

  pageStart = 0;
  pageEnd = this.INF_SCROLL_STEP;

  sorted;

  constructor(headersConfig, {
    url = [],
    sorted = {},
    isSortLocally,
  } = {},
  ) {
    this.headerConfig = headersConfig;
    this.url = url;
    this.sorted = sorted;
    this.isSortLocally = isSortLocally;

    this.sortTypeMap = headersConfig.reduce((acc, field) => ({ ...acc, [field.id]: field.sortType }), {});

    this.createElements();
    this.render();
    document.addEventListener('scroll', this.scrollHandler);
  }

  scrollHandler = () => {
    if (!this.scrollTriggerElement) {
      return;
    }

    if (window.innerHeight > this.scrollTriggerElement.getBoundingClientRect().top) {
      this.infFetch();
    }
  }

  get subElements() {
    const result = {};
    const elements = this.element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    return result;
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
    return this.sorted.id === columnId ? this.sorted.order : '';
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
    if (this.data) {
      this.body.innerHTML = this.getDataRow().join("");
      this.scrollTriggerElement = this.body.children[this.body.childElementCount - this.INF_SCROLL_ELEMENT];
    }

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

  async render() {
    const table = document.createElement('div');
    table.classList.add('sortable-table');

    this.renderHeader();
    this.renderBody();

    table.append(this.header);
    table.append(this.body);
    this.element = table;

    await this.fetch();
  }

  sortOnClient(fieldValue, orderValue, customComparator = null) {
    if (!['asc', 'desc'].includes(orderValue)) {
      throw new Error("Bad param");
    }
    if (!this.data || this.data.length === 0) {
      return;
    }

    let comparator = customComparator;
    if (!comparator) {
      switch (this.sortTypeMap[fieldValue]) {
      case 'number': comparator = numberComparator(orderValue); break;
      case 'string':
      default: comparator = stringComparator(orderValue); break;
      }
    }

    this.sorted.order = orderValue;
    this.sorted.id = fieldValue;
    this.data.sort((objA, objB) => comparator(objA[fieldValue], objB[fieldValue]));

    this.renderHeader();
    this.renderBody();
  }

  sortOnServer(fieldValue, orderValue) {
    this.sorted.id = fieldValue;
    this.sorted.order = orderValue;
    this.pageStart = 0;
    this.pageEnd = this.INF_SCROLL_STEP;
    this.data = null;
    this.lastPage = false;

    this.fetch();
  }

  sort(fieldValue, orderValue, customComparator = null) {
    if (this.isSortLocally) {
      this.sortOnClient(fieldValue, orderValue, customComparator);
    } else {
      this.sortOnServer(fieldValue, orderValue);
    }
  }

  infFetch() {
    if (this.isFetching || this.lastPage) {
      return;
    }
    this.pageStart = this.pageEnd;
    this.pageEnd = this.pageEnd + this.INF_SCROLL_STEP;

    this.fetch();
  }

  async fetch() {
    this.isFetching = true;
    const result = await fetchFromBackend(this.url + '?' + new URLSearchParams({
      _start: this.pageStart,
      _end: this.pageEnd,
      _sort: this.sorted.id,
      _order: this.sorted.order,
    }));

    if (this.data && this.data.length) {
      this.data = [...this.data, ...result];
    } else {
      this.data = result;
    }
    this.renderBody();
    if (result.length < this.INF_SCROLL_STEP) {
      this.lastPage = true;
    }
    this.isFetching = false;
    this.scrollHandler();
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
    this.remove();
    this.element = null;
    this.header = null;
    this.body = null;
    document.removeEventListener('scroll', this.scrollHandler);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }
}


