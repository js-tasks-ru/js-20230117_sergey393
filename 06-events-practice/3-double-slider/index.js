export default class DoubleSlider {
  element;

  constructor({ min = 0, max = 100, formatValue = val => (val), selected: { from = 0, to = 100 } = {} } = {}) {
    this.min = min;
    this.max = max;
    this.formatValue = formatValue;
    this.selectedFrom = from;
    this.selectedTo = to;

    this.render();
    this.addListeners();
  }

  get template() {
    const leftOffset = this.selectedFrom / (this.max - this.min) * 100;
    const rightOffset = 100 - this.selectedTo / (this.max - this.min) * 100;

    return `
      <span data-element="from">${this.formatValue(this.selectedFrom)}</span>
      <div class="range-slider__inner">
        <span class="range-slider__progress" style="left: ${leftOffset}%; right: ${rightOffset}%"></span>
        <span class="range-slider__thumb-left" style="left: ${leftOffset}%"></span>
        <span class="range-slider__thumb-right" style="right: ${rightOffset}%"></span>
      </div>
      <span data-element="to">${this.formatValue(this.selectedTo)}</span>
    `;
  }

  render() {
    if (!this.element) {
      const element = document.createElement('div');
      element.classList.add('range-slider');
      this.element = element;
    }

    this.element.innerHTML = this.template;
  }

  onPointerdownHandler = (e) => {
    this.baseSize = this.element.getElementsByClassName('range-slider__inner')[0].getBoundingClientRect();
    this.changeEl = e.target;

    if (this.changeEl.classList.contains('range-slider__thumb-left')) {
      this.changeType = 'left';
    }
    if (this.changeEl.classList.contains('range-slider__thumb-right')) {
      this.changeType = 'right';
    }

    this.change = true;
  }

  onPointerupHandler = () => {
    this.change = false;
  }

  onPointermoveHandler = (e) => {
    if (!this.change) {
      return;
    }

    switch (this.changeType) {
    case 'left': this.selectedFrom = ((e.clientX - this.baseSize.left) / this.baseSize.width * 100); break;
    case 'right': this.selectedTo = ((e.clientX - this.baseSize.left) / this.baseSize.width * 100); break;
    }

    this.fixSelected();

    this.render();

    this.element.dispatchEvent(
      new CustomEvent('range-select', { detail: { from: this.selectedFrom, to: this.selectedTo }, bubbles: true })
    );
  }

  fixSelected() {
    switch (this.changeType) {
    case 'left': {
      if (this.selectedTo < this.selectedFrom) {
        this.selectedTo = this.selectedFrom;
      }
      break;
    }
    case 'right': {
      if (this.selectedFrom > this.selectedTo) {
        this.selectedFrom = this.selectedTo;
      }
      break;
    }
    }

    if (this.selectedTo > this.max) {
      this.selectedTo = this.max;
    }
    if (this.selectedFrom < this.min) {
      this.selectedFrom = this.min;
    }

    this.selectedFrom = +(this.selectedFrom).toFixed(0);
    this.selectedTo = +(this.selectedTo).toFixed(0);
  }

  addListeners() {
    this.element.addEventListener('pointerdown', this.onPointerdownHandler);
    document.addEventListener('pointerup', this.onPointerupHandler);
    document.addEventListener('pointermove', this.onPointermoveHandler);
  }

  destroy() {
    this.element.removeEventListener('pointerdown', this.onPointerdownHandler);
    document.removeEventListener('pointerup', this.onPointerupHandler);
    document.removeEventListener('pointermove', this.onPointermoveHandler);
    this.remove();
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }
}
