import {getApi, LocalStorageManager} from "./utils.js";
// Path: front\js\product.js
// Compare this snippet from front\js\utils.js:
//
//
// export class LocalStorageManager {
//   constructor(id, color, quantity) {
//     this.id = id;
//     this.color = color;
//     this.quantity = quantity;
//   }
//
//   getOrder = JSON.parse(localStorage.getItem('orders'));
//
// }
//get orders
let cart = LocalStorageManager.getOrders;
//
//if cart is null set [] to cart
if (cart === null) {
    cart = [];
}

async function load() {
    await Product.addToCart();
    await Product.displayProduct();
}

class Product {
    constructor(id, color, quantity) {
        this.id = id;
        this.colors = color;
        this.quantity = quantity;
    };

    static getId() {
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);
        if (params.get('id')) {
            return params.get('id');
        } else {
            alert('Id not found');
        }
    };

    static async getProductData() {
        const id = Product.getId();
        try {
            const response = await fetch(`http://localhost:3000/api/products/${id}`);
            return response.json();
        } catch (e) {
            alert("Error " + e);
        }
    };

    static async displayProduct() {
        const data = await getApi(Product.getId());
        document.querySelector('#title').textContent = data.name;
        document.querySelector('#price').textContent = data.price;
        document.querySelector('#description').textContent = data.description;
        document.querySelector('.item__img').innerHTML = `<img src="${data.imageUrl}" alt="${data.altTxt}">`;
        const colors = data.colors;
        let colorRender = '';
        colors.forEach(item => {
            colorRender += `<option value="${item}">${item}</option>`;
        });
        // injection in html
        document.querySelector('#colors').innerHTML = colorRender;
        //debug
    };

    static async addToCart() {
        const productData = await getApi(Product.getId());
        //Dom elements get
        const btn = document.querySelector('#addToCart');
        const selectedColor = document.querySelector('#colors');
        const selectedQuantity = document.querySelector('#quantity');
        //Btn event on Click add to cart or update cart and save in local storage
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const max = 100;
            const min = 1;
            const quantity = selectedQuantity.value;
            let minMax = quantity > max || quantity < min;
            //schema validation for quantity
            const select = new Product(
                productData._id,
                selectedColor.value,
                Number(quantity)
            );
            if (minMax) return alert('Quantity must be between 1 and 100');
            else
            {
                /* Check **
                **IF (Product is already in cart)**
                if product.id, product.colors === select.id ,select.colors
                Add select.quantity to product.quantity
                **ELSE ()**
                * add product to cart
                *****
                *   ==> PUSH Response to cart
                *****/

                const product = cart.find(item => item.id === select.id && item.colors === select.colors);
                //check if product is already in cart and update quantity
                if (product) {
                    //check if quantity is not over 100
                    // (yes == alert)
                    if (product.quantity + select.quantity > 100) {
                        alert('Quantity is over 100');
                    } else {
                        product.quantity += select.quantity;
                        alert('Product already in cart, quantity updated : ' + product.quantity);
                    }
                } else {
                    cart.push(select);
                    //debug
                    alert('Product added to cart');
                }
                //Save response in localStorage
                LocalStorageManager.setOrders(cart);
            }
        });
    };
}
load().catch(e => console.log(e));

