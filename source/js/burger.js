const burger = document.querySelector('.js-burger');
const nav = document.querySelector('.main-nav__list');

burger.onclick = function() {
  if(this.classList.contains('main-nav__burger--opend')) {
    this.classList.remove('main-nav__burger--opend');
    this.classList.add('main-nav__burger--closed');

    nav.classList.remove('main-nav__list--opened');

  } else {
    this.classList.remove('main-nav__burger--closed');
    this.classList.add('main-nav__burger--opend');

    nav.classList.add('main-nav__list--opened');
  }
}
