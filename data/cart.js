export let cart = JSON.parse(localStorage.getItem('cart'));

if (!cart) {
    cart =  []
}

export function saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId) {
    
    let matchingId;
    
    let totalNumberOfProduct; 
    let shippingFee = 0;
    let shippingDate = ''
    parseInt(shippingFee);
    
    totalNumberOfProduct = document.querySelector(`.js-quantity-selector-${productId} select`).value;
    
    cart.forEach((id) => {
        if (productId === id.productId) {
            matchingId = true;
            id.quantity += parseInt(totalNumberOfProduct);
        }
    })
    
    if (!matchingId) { 
        cart.push({
            productId: productId, 
            quantity: parseInt(totalNumberOfProduct),
            shippingDate: shippingDate,
            shippingFee: shippingFee
        })
    }

    saveToStorage();
    
}


export function removeFromCart (productId) {
    
    let index = cart.findIndex(item => item.productId === productId);

    if (index !== -1) {
        cart.splice(index, 1);
    } else {
        console.log("Item not found in cart");
    }

    saveToStorage(); 
}

