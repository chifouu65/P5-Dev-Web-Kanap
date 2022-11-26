import {getApi, LocalStorageManager} from "./utils.js";
//get localStorageManager
let cart = LocalStorageManager.getOrders;
//if cart is null set [] to cart
if (cart === null || cart === undefined) {
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

    //get id from url params and return
    static getId() {
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);
        if (params.get('id')) {
            return params.get('id');
        } else {
            alert('Id not found');
        }
    };

    static async displayProduct() {
        //get product data from api with id
        const data = await getApi(Product.getId());
        //get dom elements
        document.querySelector('#title').textContent = data.name;
        document.querySelector('#price').textContent = data.price;
        document.querySelector('#description').textContent = data.description;
        document.querySelector('.item__img').innerHTML = `<img src="${data.imageUrl}" alt="${data.altTxt}">`;
        //iterate over colors and add to value
        const colors = data.colors;
        let colorRender = '';
        colors.forEach(item => {
            colorRender += `<option value="${item}">${item}</option>`;
        });
        // injection in html
        document.querySelector('#colors').innerHTML = colorRender;
    };

    static async addToCart() {
        //get data from api with id
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
            else {
                //check if product is already in cart (LocalStorage) with same color and id
                const product = cart.find(item =>
                    item.id === select.id &&
                    item.colors === select.colors
                );
                //if product is already in cart update quantity
                if (product) {
                    //check if quantity is not over 100
                    // (yes == alert)
                    if (product.quantity + select.quantity > max) {
                        return alert('Quantity is over 100');;
                    } else {
                        product.quantity += select.quantity;
                        alert('Product already in cart, quantity updated : ' + product.quantity);
                    }
                    //else if product is not in cart add product to cart
                } else {
                    cart.push(select);
                    alert('Product added to cart');
                }
                //Push cart in local storage
                LocalStorageManager.setOrders(cart);
            }
        });
    };
}

load().catch(e => console.log(e));

