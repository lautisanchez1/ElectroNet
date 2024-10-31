// Array para almacenar los productos en el carrito (lo cargamos de localStorage si existe)
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Función para agregar un producto al carrito
function addToCart(id, name, price) {
    const product = cart.find(item => item.id === id);
    
    if (product) {
        // Si el producto ya está en el carrito, aumentamos la cantidad
        product.quantity += 1;
    } else {
        // Si el producto no está en el carrito, lo agregamos
        cart.push({ id, name, price, quantity: 1 });
    }

    // Guardar el carrito actualizado en localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartNumber();
    loadCart();
}

// Función para incrementar o disminuir la cantidad de un producto sin refrescar la página
function updateQuantity(id, change) {
    const product = cart.find(item => item.id === id);
    if (product) {
        product.quantity += change;
        if (product.quantity < 1) {
            // Si la cantidad es menor que 1, eliminamos el producto del carrito
            cart = cart.filter(item => item.id !== id);
        }
        // Guardar el carrito actualizado en localStorage
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartNumber();
        loadCart();
    }
}

// Función para actualizar la cantidad mostrada de un producto específico sin recargar la página
function updateProductDisplay(id, quantity) {
    const quantityElement = document.querySelector(`#quantity-${id}`);
    if (quantityElement) {
        quantityElement.textContent = quantity;
    }
}

// Función para cargar los productos del carrito desde localStorage y mostrarlos
function loadCart() {
    const container = document.getElementById("productos-carrito-container");
    container.innerHTML = "";

    cart.forEach(item => {
        const productElement = document.createElement("div");
        productElement.classList.add("product-item");
        productElement.innerHTML = `
            <div class="producto-en-carrito">
                <p class="producto-col">Producto: ${item.name}</p>
                <p class="precio-col">Precio: U$S ${item.price}</p>
                <p class="cantidad-col">Cantidad: <button class="button-rest-cart" onclick="updateQuantity('${item.id}', -1)">-</button><span id="quantity-${item.id}">${item.quantity}</span><button class="button-sum-cart" onclick="updateQuantity('${item.id}', 1)">+</button></p>
            </div>
        `;
        container.appendChild(productElement);
    });

    loadCartTotals();
}

// Función para actualizar el total de unidades y el precio sin refrescar la página completa
function loadCartTotals() {
    const totalUnits = document.getElementById("total-unidades");
    const totalPrice = document.getElementById("total-precio");
    const proceedButton = document.getElementById("proceder-al-pago"); // Botón de "Proceder al pago"
 
    let units = 0;
    let priceTotal = 0;

    cart.forEach(item => {
        units += item.quantity;
        priceTotal += item.price * item.quantity;
    });

    totalUnits.textContent = units;
    totalPrice.textContent = priceTotal.toFixed(2);

    // Habilitar o deshabilitar el botón "Proceder al pago"
    if (units > 0) {
        proceedButton.disabled = false; // Habilitar si el carrito tiene productos
    } else {
        proceedButton.disabled = true;  // Deshabilitar si el carrito está vacío
    }
}

// Función para vaciar el carrito
function emptyCart() {
    localStorage.removeItem("cart");
    cart = [];
    loadCart(); // Actualizamos la vista después de vaciar
    updateCartNumber();
}

// Agregar manejador de eventos a cada botón de "Agregar al carrito"
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const id = button.getAttribute('data-id');
        const name = button.getAttribute('data-name');
        const price = parseFloat(button.getAttribute('data-price'));
        addToCart(id, name, price);
    });
});

// Ejecutamos `loadCart` cuando se carga la página
document.addEventListener("DOMContentLoaded", () => {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
    loadCart();
    updateCartNumber();
    loadCartTotals();
    updateCartNumber();
});

// Agregamos el evento al botón de "Vaciar Carrito"
document.getElementById("vaciar-carrito").addEventListener("click", emptyCart);

// Función para actualizar el número total de productos en el carrito
function updateCartNumber() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById("total-carrito").textContent = totalItems;
}

// Función para solicitar los datos de pago y mostrar una alerta de confirmación
function proceedToPayment(priceTotal) {
    async function requestUserInfo(priceTotal) {
        const { value: formValues } = await Swal.fire({
            title: "Ingrese sus datos de pago",
            html: `
                <label>Nombre:</label>
                <input id="swal-input1" class="swal2-input" placeholder="Nombre completo">
                <label>Email:</label>
                <input id="swal-input2" class="swal2-input" placeholder="Correo electrónico">
                <label>Teléfono:</label>
                <input id="swal-input4" class="swal2-input" placeholder="Número de teléfono">
                <label>Dirección:</label>
                <input id="swal-input3" class="swal2-input" placeholder="Dirección de envío">
                <label>Tarjeta:</label>
                <input id="swal-input5" class="swal2-input" placeholder="Número de tarjeta">
            `,
            focusConfirm: false,
            preConfirm: () => {
                const name = document.getElementById("swal-input1").value;
                const email = document.getElementById("swal-input2").value;
                const phone = document.getElementById("swal-input4").value;
                const address = document.getElementById("swal-input3").value;
                const cardNumber = document.getElementById("swal-input5").value;
    
                const nameIsValid = /^[A-Za-z\s]+$/.test(name);
                const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
                const phoneIsValid = /^[0-9]+$/.test(phone);
                const addressIsValid = /^[A-Za-z0-9\s]+$/.test(address);
                const cardNumberIsValid = /^[0-9]+$/.test(cardNumber);
    
                if (!nameIsValid) {
                    Swal.showValidationMessage("El nombre solo debe contener letras y espacios.");
                    return false;
                }
                if (!emailIsValid) {
                    Swal.showValidationMessage("El correo electrónico debe tener un formato válido.");
                    return false;
                }
                if (!phoneIsValid) {
                    Swal.showValidationMessage("El teléfono solo debe contener números.");
                    return false;
                }
                if (!addressIsValid) {
                    Swal.showValidationMessage("La dirección solo debe contener letras, números y espacios.");
                    return false;
                }
                if (!cardNumberIsValid) {
                    Swal.showValidationMessage("El número de tarjeta solo debe contener números.");
                    return false;
                }
    
                return { name, email, address, phone, cardNumber };
            }
        });
    
        if (formValues) {
            Swal.fire({
                title: "Confirmación de Pago",
                html: `
                    <p><strong>Nombre:</strong> ${formValues.name}</p>
                    <p><strong>Email:</strong> ${formValues.email}</p>
                    <p><strong>Teléfono:</strong> ${formValues.phone}</p>
                    <p><strong>Dirección de envío:</strong> ${formValues.address}</p>
                    <p><strong>Número de tarjeta: </strong>${formValues.cardNumber}</p>
                `,
                icon: 'success',
                confirmButtonText: 'OK',
            });
            emptyCart();
        }
    }
    
    requestUserInfo();
}

// Agregar el evento al botón de "Proceder al pago"
document.getElementById("proceder-al-pago").addEventListener("click", proceedToPayment);
