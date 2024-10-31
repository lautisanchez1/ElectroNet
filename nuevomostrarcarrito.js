// Obtener el elemento donde se muestra el total de productos en el carrito
const cartCounter = document.getElementById("total-carrito");

// Obtener el carrito del localStorage, o inicializar un carrito vacío si no existe
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Función para actualizar el contador en el header
function updateCartCounter() {
    // Calcular el total de productos en el carrito sumando las cantidades de cada producto
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCounter.textContent = totalItems;

    // Guardar el total de productos en localStorage para conservar el valor al refrescar
    localStorage.setItem("cartTotalItems", totalItems);
}

// Llamar a esta función al cargar la página para que el contador esté actualizado
updateCartCounter();

// Event listener para el botón "Agregar al carrito"
document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", (event) => {
        const id = event.target.dataset.id;
        const name = event.target.dataset.name;
        const price = parseFloat(event.target.dataset.price);

        // Buscar el producto en el carrito por su id
        let product = cart.find(item => item.id === id);
        
        if (product) {
            // Si el producto ya está en el carrito, incrementar la cantidad
            product.quantity += 1;
        } else {
            // Si el producto no está en el carrito, agregarlo con cantidad 1
            cart.push({ id, name, price, quantity: 1 });
        }

        // Guardar el carrito actualizado en localStorage
        localStorage.setItem("cart", JSON.stringify(cart));

        // Actualizar el contador en el header
        updateCartCounter();
    });
});

// Event listener para el botón de reducir cantidad (-)
document.querySelectorAll(".remove-from-cart").forEach(button => {
    button.addEventListener("click", (event) => {
        const id = event.target.dataset.id;
        
        // Buscar el producto en el carrito por su id
        let productIndex = cart.findIndex(item => item.id === id);
        
        if (productIndex !== -1) {
            let product = cart[productIndex];
            
            // Reducir la cantidad del producto si es mayor a 1
            if (product.quantity > 1) {
                product.quantity -= 1;
            } else {
                // Si la cantidad es 1, remover el producto del carrito
                cart.splice(productIndex, 1);
            }

            // Guardar el carrito actualizado en localStorage
            localStorage.setItem("cart", JSON.stringify(cart));

            // Actualizar el contador en el header
            updateCartCounter();
        }
    });
});

// Mantener el contador actualizado al cargar la página usando el valor guardado en localStorage
window.addEventListener("load", () => {
    const savedTotalItems = localStorage.getItem("cartTotalItems");
    if (savedTotalItems) {
        cartCounter.textContent = savedTotalItems;
    }
});
