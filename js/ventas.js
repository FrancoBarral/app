const { createApp } = Vue;

var title = document.title;
let menu_item = document.querySelector("#product")

if (title == "Inventario") {
  menu_item.classList.add("nav-item-active")
  console.log(menu_item.classList)
}

