'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const menuIcon = document.querySelector('.menu__icon'),
          menuBody = document.querySelector('.menu__body');
    console.log(menuIcon);
    menuIcon.addEventListener('click', () => {
        menuBody.classList.toggle('show');
        menuIcon.classList.toggle('active');

    })
});