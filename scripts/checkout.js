import {cart, removeFromCart, saveToStorage} from '../data/cart.js'
import {products} from '../data/products.js'
import { formatCurrency } from './utils/money.js';
import   dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js'

let orderSummaryHTML = ''

const today = dayjs();
const deliverydate1 = today.add(7, 'day');
const deliverydate2 = today.add(3, 'day');
const deliverydate3 = today.add(1, 'day');
console.log(deliverydate1.format('dddd, MMMM, D')); 
console.log(deliverydate2.format('dddd, MMMM, D')); 
console.log(deliverydate3.format('dddd, MMMM, D')); 

cart.forEach((item) => {
  
  const productId = item.productId;       
  
  let matchingProduct;

  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  })
  
    orderSummaryHTML += `
    <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
    <div class="delivery-date delivery-date-${matchingProduct.id}">
      Delivery date: ${deliverydate1.format('dddd, MMMM D')}
    </div>

    <div class="cart-item-details-grid">
      <img class="product-image"
        src="${matchingProduct.image}">

      <div class="cart-item-details">
        <div class="product-name">
          ${matchingProduct.name}
        </div>
        <div class="product-price">
          $${formatCurrency(matchingProduct.priceCents)}
        </div>
           <div class="product-quantity js-product-quantity-${matchingProduct.id}">
            <span>
                Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${item.quantity}</span>
            </span>
            <span class="link-primary js-update-item-button js-update-button-${matchingProduct.id}" data-product-id = "${matchingProduct.id}">
                Update
            </span>
            <form class="update-product-form js-update-product-form update-product-form-${matchingProduct.id}">
            <input type= "number" value= ${item.quantity}>
          </form>
            <span class="save-quantity-link link-primary js-save-item-button js-save-button-${matchingProduct.id}" data-product-id = "${matchingProduct.id}">
                Save
            </span>
            <span class="delete-quantity-link link-primary js-delete-item-button" data-product-id = "${matchingProduct.id}" >
                Delete
            </span>
        </div>
      </div>

      <div class="delivery-options">
        <div class="delivery-options-title">
          Choose a delivery option:
        </div>

        <div class="delivery-option delivery-option-1-${matchingProduct.id} delivery-option-1">
          <input type="radio" checked class="delivery-option-input-${matchingProduct.id}" data-product-id = "${matchingProduct.id}"
            name="${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
            ${deliverydate1.format('dddd, MMMM D')}
            </div>
            <div class="delivery-option-price">
              FREE Shipping
            </div>
          </div>
        </div>
        <div class="delivery-option delivery-option-2-${matchingProduct.id} delivery-option-2">
          <input type="radio" class="delivery-option-input-${matchingProduct.id}" data-product-id = "${matchingProduct.id}"
            name="${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
            ${deliverydate2.format('dddd, MMMM D')}
            </div>
            <div class="delivery-option-price">
            $4.99 - Shipping
            </div>
          </div>
        </div>
        <div class="delivery-option delivery-option-3-${matchingProduct.id} delivery-option-3">
          <input type="radio" class="delivery-option-input-${matchingProduct.id}" data-product-id = "${matchingProduct.id}"
            name="${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
            ${deliverydate3.format('dddd, MMMM D')}
            </div>
            <div class="delivery-option-price">
              $9.99 - Shipping
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`
})

document.querySelector('.js-order-summary').innerHTML = orderSummaryHTML; 
function updateCartPayment(shippingFee) {
    let totalBeforeTax = 0;
    // totalBeforeTax = totalBeforeTax.toFixed(2);

    cart.forEach((item) => {
        // Find the product in the products array
        let product = products.find(p => p.id === item.productId);

        // If the product is found, add its price (multiplied by quantity) to the total
        if (product) {
            totalBeforeTax += (item.quantity * product.priceCents / 100); 
        }
      });

      shippingFee = shippingFee / 100

      let totalItems = 0;
      cart.forEach((item) => {
          totalItems += item.quantity;
      })

      let paymentSummaryHTML = 
      ` <div class="payment-summary-title"> 
          Order Summary
          </div>

          <div class="payment-summary-row">
          <div>Items (${totalItems}):</div>
          <div class="payment-summary-money">$${totalBeforeTax.toFixed(2)}</div>
          </div>

          <div class="payment-summary-row">
          <div>Shipping &amp; handling:</div>
          <div class="payment-summary-money">$${(shippingFee).toFixed(2)}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
          <div>Total before tax:</div>
          <div class="payment-summary-money">$${(totalBeforeTax + shippingFee).toFixed(2)}</div>
          </div>

          <div class="payment-summary-row">
          <div>Estimated tax (10%):</div>
          <div class="payment-summary-money">$${((totalBeforeTax + shippingFee) * 0.1).toFixed(2)}</div>
          </div>

          <div class="payment-summary-row total-row">
          <div>Order total:</div>
          <div class="payment-summary-money">$${((totalBeforeTax + shippingFee) + ((totalBeforeTax + shippingFee) * 0.1)).toFixed(2)}</div>
          </div>

          <button class="place-order-button button-primary">
          Place your order
          </button> `

          document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;
}


function updateCheckoutHeaderSection() {

  let totalItems = 0;
  cart.forEach((item) => {
      totalItems += item.quantity;
  })

    let checkoutHeaderMiddleSectionHTML = `
        Checkout (<a class="return-to-home-link"
        href="amazon.html"> ${totalItems} items</a>) `
    
    document.querySelector('.js-checkout-header-middle-section').innerHTML = checkoutHeaderMiddleSectionHTML;
}

function cartIsEmpty() {
  if (cart.length === 0) {
    document.querySelector('.js-view-products').classList.remove('js-view-products')
  }
}


updateCheckoutHeaderSection();
updateCartPayment(0);

document.querySelectorAll('.js-delete-item-button').forEach((button) => {
  button.addEventListener('click', () => {
    
    const productId = button.dataset.productId;
    
    removeFromCart(productId);
    
    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    container.remove(); 
     
    updateCheckoutHeaderSection();
    updateCartPayment(0);
    
    cartIsEmpty();
    
  })
});

cartIsEmpty();

function removeItem(productId) {

  removeFromCart(productId);
  const container = document.querySelector(`.js-cart-item-container-${productId}`);
  container.remove(); 

}

document.querySelectorAll('.js-update-item-button').forEach((button) => {
  button.addEventListener('click', () => {
    const productId = button.dataset.productId;
    let productQuantity = 0;

    cart.forEach((item) => {
        if (item.productId === productId) {
            productQuantity = item.quantity;
        }
    })

    document.querySelector(`.js-update-button-${productId}`).classList.add('update-quantity-link');
    document.querySelector(`.js-save-button-${productId}`).classList.remove('save-quantity-link')
    document.querySelector(`.update-product-form-${productId}`).classList.remove('update-product-form')


    document.querySelectorAll(`.js-save-button-${productId}`).forEach((button) => {
        button.addEventListener('click', () => {
          
          const newProductQuantity = document.querySelector(`.update-product-form-${productId} input`).value;

            cart.forEach((item) => {
                if (item.productId === productId) {
                  item.quantity = parseInt(newProductQuantity);
                }
              })
            
              document.querySelector(`.js-update-button-${productId}`).classList.remove('update-quantity-link');
              document.querySelector(`.js-save-button-${productId}`).classList.add('save-quantity-link');
              document.querySelector(`.update-product-form-${productId}`).classList.add('update-product-form');
              document.querySelector(`.js-quantity-label-${productId}`).innerHTML = newProductQuantity;

              const checkZeroQuantity = document.querySelector(`.js-quantity-label-${productId}`).innerHTML;
              parseInt(checkZeroQuantity);

              if (checkZeroQuantity < 1) {   
                removeItem(productId) 
              }
              
              updateCheckoutHeaderSection();
              updateCartPayment(0);
              cartIsEmpty();
              saveToStorage();
              
            })
            
    })     
  })
})

updateShippingFee();

function updateShippingFee() {

  let totalShippingFee = 0; 
   
  cart.forEach((item) => {
    totalShippingFee += item.shippingFee;
  })

  updateCartPayment(totalShippingFee);
}


function editHTML() {

  const shippingDate1 = `${deliverydate1.format('dddd, MMMM D')}`
  const shippingDate2 = `${deliverydate2.format('dddd, MMMM D')}`
  const shippingDate3 = `${deliverydate3.format('dddd, MMMM D')}`

  cart.forEach((item) => {
    if (item.shippingDate === shippingDate1 ) {
      document.querySelector(`.delivery-option-1-${item.productId}`).innerHTML = 
    `<input type="radio" checked class="delivery-option-input-${item.productId}" data-product-id = "${item.productId}"
    name="${item.productId}">
    <div>
    <div class="delivery-option-date">
    ${deliverydate1.format('dddd, MMMM D')}
    </div>
    <div class="delivery-option-price">
    FREE Shipping
    </div>
    </div>`
    }
  
  })

  cart.forEach((item) => {
    if (item.shippingDate === shippingDate2 ) {
      document.querySelector(`.delivery-option-2-${item.productId}`).innerHTML = 
    `<input type="radio" checked class="delivery-option-input-${item.productId}" data-product-id = "${item.productId}"
    name="${item.productId}">
    <div>
    <div class="delivery-option-date">
    ${deliverydate2.format('dddd, MMMM D')}
    </div>
    <div class="delivery-option-price">
    $4.99 - Shipping
    </div>
    </div>`
    }
  
  })

  cart.forEach((item) => {
    if (item.shippingDate === shippingDate3 ) {
      document.querySelector(`.delivery-option-3-${item.productId}`).innerHTML = 
    `<input type="radio" checked class="delivery-option-input-${item.productId}" data-product-id = "${item.productId}"
    name="${item.productId}">
    <div>
    <div class="delivery-option-date">
    ${deliverydate3.format('dddd, MMMM D')}
    </div>
    <div class="delivery-option-price">
    $9.99 - Shipping
    </div>
    </div>`
    }
  
  })
    
}

editHTML();

document.querySelectorAll('.delivery-option-1 input').forEach((button) => {
  button.addEventListener('click', () => {
    const productId = button.dataset.productId;     

    const shippingDate = `${deliverydate1.format('dddd, MMMM D')}`
    const shippingFeeCents = 0  
  
    cart.forEach((item) => {
      if (productId === item.productId) {
        item.shippingDate = shippingDate;
        item.shippingFee = shippingFeeCents;
      }
    })

    document.querySelector(`.delivery-date-${productId}`).innerHTML = `Delivery date: ${shippingDate}`;
    
    updateShippingFee();
    saveToStorage();
    
  })
})


document.querySelectorAll('.delivery-option-2 input').forEach((button) => {
  button.addEventListener('click', () => {
    const productId = button.dataset.productId;

    const shippingDate = `${deliverydate2.format('dddd, MMMM D')}`
    const shippingFeeCents = 499  

    cart.forEach((item) => {
      if (productId === item.productId) {
        item.shippingDate = shippingDate;
        item.shippingFee = shippingFeeCents;
      }
    })

    document.querySelector(`.delivery-date-${productId}`).innerHTML = `Delivery date: ${shippingDate}`;

    updateShippingFee();
    saveToStorage();
    
  })
})

document.querySelectorAll('.delivery-option-3 input').forEach((button) => {
  button.addEventListener('click', () => {
    const productId = button.dataset.productId;

    const shippingDate = `${deliverydate3.format('dddd, MMMM D')}`
    const shippingFeeCents = 999  

    cart.forEach((item) => {
      if (productId === item.productId) {
        item.shippingDate = shippingDate;
        item.shippingFee = shippingFeeCents;
      }
    })

    document.querySelector(`.delivery-date-${productId}`).innerHTML = `Delivery date: ${shippingDate}`;

    updateShippingFee();
    saveToStorage();

  })
})

