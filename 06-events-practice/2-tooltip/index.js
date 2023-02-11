class Tooltip {
  static instance = null;
  element;
  message = '';

  TOOLTIP_OFFSET = 10;

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }

    Tooltip.instance = this;
    this.render();
  }

  onOver = (e) => {
    this.message = e.target.dataset.tooltip;
    if (this.message) {
      this.render();
      this.element.style.visibility = 'visible';
      e.target.addEventListener('pointermove', this.onMove);
      e.target.addEventListener('pointerout', this.onOut, { once: true });
    }
  }

  onMove = (e) => {
    if (this.element) {
      this.element.style.left = (e.clientX + this.TOOLTIP_OFFSET) + 'px';
      this.element.style.top = (e.clientY + this.TOOLTIP_OFFSET) + 'px';
    }
  }

  onOut = (e) => {
    this.message = null;
    if (this.element) {
      this.element.style.visibility = 'hidden';
    }
    e.target.removeEventListener('pointerout', this.onMove);
  }

  render() {
    if (!this.element) {
      const element = document.createElement('div');
      element.classList.add('tooltip');
      this.element = element;
    }

    document.body.append(this.element);
    this.element.innerHTML = this.message;
  }

  initialize() {
    document.addEventListener('pointerover', this.onOver);
    setTimeout(() => this.destroy(), 5000);
  }

  destroy() {
    document.removeEventListener("pointerover", this.onOver);
    this.remove();
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
    this.element = null;
  }
}

export default Tooltip;
