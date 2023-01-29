export class Title {
  element;

  title;
  link;

  constructor({ title, link }) {
    this.title = title;
    this.link = link;

    this.update({});
  }

  update({ title, link }) {
    if (title) {
      this.title = title;
    }
    if (link) {
      this.title = link;
    }
    this.render();
  }

  render() {
    const element = document.createElement('div');
    element.classList.add('column-chart__title');
    element.innerHTML = this.title;

    if (this.link) {
      const link = document.createElement('a');
      link.classList.add('column-chart__link');
      link.innerHTML = 'View all';
      link.href = this.link;

      element.append(link);
    }

    this.element = element;
  }
}
