export default class NotificationMessage {
  static activeNotification = null;
  static activeTimeout = null;
  element;

  constructor(text, { duration = 1000, type = 'success' } = {}) {
    this.text = text;
    this.duration = duration;
    this.type = type;

    this.render();
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `<div class="notification ${this.type}" style="--value:${this.duration}ms">
      <div class="timer"></div>
      <div class="inner-wrapper">
        <div class="notification-header">${this.type}</div>
        <div class="notification-body">
          ${this.text}
        </div>
      </div>
    </div>`;

    this.element = wrapper.firstElementChild;
  }

  static removeActive() {
    if (NotificationMessage.activeNotification) {
      NotificationMessage.activeNotification.remove();
      NotificationMessage.activeNotification = null;
    }
    if (NotificationMessage.activeTimeout) {
      clearTimeout(NotificationMessage.activeTimeout);
    }
  }

  destroy() {
    this.element.remove();
    NotificationMessage.removeActive();
  }

  remove() {
    this.element.remove();
    NotificationMessage.removeActive();
  }

  show(element = null) {
    if (element) {
      this.element = element;
    }
    if (NotificationMessage.activeNotification) {
      NotificationMessage.removeActive();
    }
    NotificationMessage.activeNotification = this.element;
    document.body.append(this.element);
    NotificationMessage.activeTimeout = setTimeout(() => {
      this.remove();
    }, this.duration);
  }
}
