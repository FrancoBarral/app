const { createApp } = Vue;

var title = document.title;
let menu_item = document.querySelector("#product")

if (title == "Inventario") {
  menu_item.classList.add("nav-item-active")
  console.log(menu_item.classList)
}

createApp({
  data() {
    return {
      productos: [],
      //url:'http://localhost:5000/productos',
      // si el backend esta corriendo local usar localhost 5000(si no lo subieron a pythonanywhere)
      url: "http://localhost:5000/productos", // si ya lo subieron a pythonanywhere
      error: false,
      cargando: true,
      errorNoProducts: false,
      /*atributos para el guardar los valores del formulario */
      id: 0,
      nombre: "",
      descripcion: "",
      imagen: "",
      stock: 0,
      precio: 0,
      busqueda: "",
    };
  },
  methods: {
    fetchData(url) {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          this.productos = data;
          this.cargando = false;
        })
        .catch((err) => {
          console.error(err);
          this.error = true;
          this.cargando = false;
        });
    },
    eliminar(producto) {
      const url = this.url + "/" + producto;
      var options = {
        method: "DELETE",
      };
      fetch(url, options)
        .then((res) => res.text()) // or res.json()
        .then((res) => {
          location.reload();
        });
    },
    grabar() {
      let producto = {
        nombre: this.nombre,
        descripcion: this.descripcion,
        precio: this.precio,
        stock: this.stock,
        imagen: this.imagen
      };
      var options = {
        body: JSON.stringify(producto),
        method: "POST",
        headers: { "Content-Type": "application/json" },
        redirect: "follow",
      };
      fetch(this.url, options)
        .then(function () {
          alert("Registro grabado");
          window.location.href = "./productos.html";
        })
        .catch((err) => {
          console.error(err);
          alert("Error al Grabarr");
        });
    },
    buscar() {
      descripcionBuscada = this.busqueda.split(" ").toString();
      url = "http://localhost:5000/busqueda";
      options = {
        body: JSON.stringify({ lista: descripcionBuscada }),
        method: "POST",
        headers: { "Content-Type": "application/json" },
        redirect: "follow",
      };

      if (descripcionBuscada.length > 0) {
        fetch(url, options)
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            this.errorNoProducts = false;
            if (data.length > 0) {
              this.productos = data;
              this.cargando = false;
            }
            else {
              this.errorNoProducts = true;
            }
          })
          .catch((err) => {
            console.error(err);
            this.error = true;
          });
      } else {
        this.fetchData(this.url);
      }
    },
  },
  created() {
    this.fetchData(this.url);
  },
  update() {
    this.buscar();
  },
}).mount("#app");
