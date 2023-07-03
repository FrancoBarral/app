const { createApp } = Vue;

var title = document.title;
let menu_item = document.querySelector("#orders");
let selectProduct = document.getElementById("selectProduct");
let stock_non_editable = document.getElementById("stock-non-editable");
let fecha_compra = document.getElementById("date-compra")

var fecha_actual = new Date();

var dia = fecha_actual.getDate();
var mes = fecha_actual.getMonth();
var año = fecha_actual.getFullYear();

var fecha_formateada = (dia < 10 ? '0' + dia : dia) + "/" + (mes < 10 ? '0' + mes : mes) + '/' + año;

fecha_actual.value = fecha_formateada


if (title == "Ventas") {
  menu_item.classList.add("nav-item-active");
  console.log(menu_item.classList);
}

createApp({
  data() {
    return {
      productos: [],
      productosSeleccionados: [],
      //url:'http://localhost:5000/productos',
      // si el backend esta corriendo local usar localhost 5000(si no lo subieron a pythonanywhere)
      url: "http://localhost:5000/productos", // si ya lo subieron a pythonanywhere
      error: false,
      cargando: true,
      errorNoProducts: false,
      /*atributos para el guardar los valores del formulario */
      busqueda: '',
      stockProducto: null,
      productoSeleccionado: "",
      precioFinal: 0,
      numeroVenta: 0,
      cliente: "",
      metodoPago: "",
      tipoFactura: "",
      dateCompra: "",
    };
  },
  methods: {
    fetchData(url) {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          this.productos = data
        })
        .catch((err) => {
          console.error(err);
          this.error = true;
          this.cargando = false;
        });
    },
    actualizarStock() {
      if (this.productoSeleccionado) {
        this.stockProducto = this.productos[this.productoSeleccionado-1].stock;
        console.log(this.stockProducto)
      }
      else {
        this.stockProducto = '';
      }
    },
    agregarProductos() {
      if (this.productoSeleccionado && this.cantidad > 0) {
        // Actualiza la cantidad comprada del producto seleccionado
        this.productos[this.productoSeleccionado-1].cantidad = this.cantidad;

        this.productos[this.productoSeleccionado-1].precioTotal = this.productos[this.productoSeleccionado-1].cantidad * this.productos[this.productoSeleccionado-1].precio

        this.productosSeleccionados.push(this.productos[this.productoSeleccionado-1]);
        
        this.precioFinal += this.productos[this.productoSeleccionado-1].precioTotal

        // Reinicia la selección del producto y la cantidad
        this.productoSeleccionado = null;
        this.stockProducto = "";
        this.cantidad = "";
      }

    },
    generarVenta() {  
      ulrVenta = "http://localhost:5000/registrar_venta";
      bodyVenta = {
        "idVenta": this.numeroVenta,
        "nombreCliente": this.cliente,
        "metodoPago": this.metodoPago,
        "tipoFactura": this.tipoFactura,
        "fechaCompra": this.fechaCompra,
        "productos": this.productosSeleccionados
      }
      options = {
        body: JSON.stringify(bodyVenta),
        method: "POST",
        headers: { "Content-Type": "application/json" },
        redirect: "follow",
      };
    },
  },
  mounted() {
    this.fetchData(this.url);
  },
}).mount("#app");
