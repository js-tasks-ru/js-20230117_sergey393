class Tooltip {
  static instance = null;
  element;
  message = '';

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }

    Tooltip.instance = this;
    this.render();
  }

  onOver(e) {
    this.message = e.target.dataset.tooltip;
    if (this.message) {
      this.render();
      this.element.style.visibility = 'visible';
      e.target.addEventListener('pointermove', this.onMove.bind(this));
      e.target.addEventListener('pointerout', this.onOut.bind(this), { once: true });
    }
  }

  onMove(e) {
    if (this.element) {
      this.element.style.left = (e.clientX + 10) + 'px';
      this.element.style.top = (e.clientY + 10) + 'px';
    }
  }

  onOut(e) {
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
    document.body.addEventListener('pointerover', this.onOver.bind(this));
  }

  destroy() {
    document.body.removeEventListener("pointerover", this.onOver);
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
