Object.defineProperty(String.prototype, 'capitalize', {
    value: function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
    },
    enumerable: false
});

const statusList = {
    0: "pendiente",
    1: "despachado",
    2: "proceso",
    3: "cancelado",
    4: "completado",
    5: "devuelto"
}