import {ApiManager, LocalStorageManager} from "./utils.js";
import {getApi} from "./utils.js";

const storage = LocalStorageManager.getOrders;
let valid = false;


if (storage === null) {
    empty();
} else {
    getApi()
        .then(() => {
            displayCart().catch((err) => console.log(err));
            //Add event after render
            setTimeout(() => {
                removeProductInCart().catch((err) => console.log(err));
                updateQuantity().catch((err) => console.log(err));
                total().catch((err) => console.log(err));
            }, 1000);
        }).catch(error => {
        console.log(error);
    });
}

let price = document.querySelector('#totalPrice')
let quantity = document.querySelector('#totalQuantity');

//get total price & total quantity articles
async function total() {
    let qty = 0;
    let amt = 0;
    let add;
    if (storage !== 0) {
        for (let item of storage) {
            qty += Number(item.quantity);
            const data = await getApi(item.id);
            add = item.quantity * data.price;
            amt += add;
        }
    }
    quantity.innerHTML = qty;
    price.innerHTML = amt;
}

function empty() {
    document.querySelector('.cart').hidden = true;
    document.querySelector('#empty').innerHTML = `Votre panier est vide :( <br/><a href="index.html">Home</a>`;
}

async function displayCart() {
    let render = "";
    for (let item of storage) {
        //check size of product if over 100 => display 100 if is < 1 => display 1
        if (item.quantity > 100) {
            item.quantity = 100;
        } else if (item.quantity < 1) {
            item.quantity = 1;
        }

        const data = await getApi(item.id);

        const htmlRender = `      
           <article class="cart__item" data-id="${item.id}" data-color="${item.colors}">
                <div class="cart__item__img">
                    <img src="${data.imageUrl}" alt="${data.altTxt}">
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${data.name}</h2>
                        <p>${item.colors}</p>
                        <p>${data.price} €</p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input type="number" id="item_qty" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.quantity}">
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                        </div>
                    </div>
                </div>
            </article>
            `;
        render += htmlRender;
    }
    document.querySelector('#cart__items').innerHTML = render;
}

async function removeProductInCart() {
    const btnDelete = await document.querySelectorAll('p.deleteItem');
    for (let btn of btnDelete) {
        btn.addEventListener('click', (e) => {
            //get id & color of product click
            let parent = e.target.parentNode.parentNode.parentNode.parentNode
            const id = parent.dataset.id;
            const color = parent.dataset.color;
            //remove product in storage
            //reload page if cart is empty
            for (let i = 0; i < storage.length; i++) {
                //if id & color are the same in storage & input => remove product in storage
                if (storage[i].id === id && storage[i].colors === color) {
                    storage.splice(i, 1);
                    LocalStorageManager.setOrders(storage);
                    const article = parent;
                    article.remove();
                    total().catch((err) => console.log(err));
                    //reload page if cart is empty

                    //debug
                    console.log(`Produit remove : ${id} - ${color}`);
                    console.log(storage);

                    if (storage.length === 0) {
                        window.location.reload();
                    }
                }
            }
        });
    }
}

async function updateQuantity() {
    const inputQty = document.querySelectorAll('input.itemQuantity');
    for (let input of inputQty) {
        //add event on all input with class itemQuantity
        input.addEventListener('change', (e) => {
            //get product id colors & quantity in input
            let parent = e.target.parentNode.parentNode.parentNode.parentNode
            const id = parent.dataset.id;
            const color = parent.dataset.color;
            const qty = e.target.value
            //debug
            for (let i = 0; i < storage.length; i++) {
                //if id & color are the same in storage & input => update quantity in storage
                if (storage[i].id === id && storage[i].colors === color) {
                    //check if value is between 1 & 100
                    if (qty >= 1 && qty <= 100) {
                        storage[i].quantity = qty;
                        LocalStorageManager.setOrders(storage);
                        total();
                        console.log(storage[i]);
                    } else {
                        alert("La quantité doit être comprise entre 1 et 100");
                        e.target.value = storage[i].quantity;
                    }
                }
            }
        });
    }
}

const formQuestion = document.querySelectorAll('.cart__order__form__question input');
formQuestion.forEach((input) => {
    input.addEventListener('change', () => {
        validation(input);
    })
})

function validateForm() {
    for (let form of formQuestion) {
        valid = !(form.value === "" || form.classList.contains('error'));
        if (!valid) {
            valid = false;
            break;
        } else {
            valid = true;
        }
    }
    console.log('formulaire valide : ' + valid)
    return valid;
}

function validation(input) {
    const regexFirstName = new RegExp(/^([a-zA-ZÀ-ÿ]{2,26})(-[a-zA-ZÀ-ÿ]{2,26})?(\s[a-zA-ZÀ-ÿ]{2,26})?$/, 'g')
    const regexLastName = new RegExp(/^([a-zA-ZÀ-ÿ]{2,26})(-[a-zA-ZÀ-ÿ]{2,26})?(\s[a-zA-ZÀ-ÿ]{2,26})?$/, 'g')
    const regexAddress = new RegExp(/^([0-9]{0,2}(^| ?)[a-zA-ZÀ-ÿ]{2,26})/, 'g')
    const regexCity = new RegExp(/^([a-zA-ZÀ-ÿ]{2,26})(-[a-zA-ZÀ-ÿ]{2,26})?(\s[a-zA-ZÀ-ÿ]{2,26})?$/, 'g')
    const regexEmail = new RegExp(/[A-z0-9._-]+[@]{1}[a-zA-Z0-9._-]+[.]{1}[a-zA-Z]{2,10}/gm, 'g')
    const err = input.nextElementSibling

    const check = (input, regex) => {
        if (regex.test(input.value)) {
            err.textContent = "Validé";
            input.classList.remove('error');
        } else {
            err.textContent = `Non valid ${input.name}`;
            input.classList.add('error');
        }
    }
    switch (input.name) {
        case 'firstName':
            check(input, regexFirstName);
            break;
        case 'lastName':
            check(input, regexLastName);
            break;
        case 'address':
            check(input, regexAddress);
            break;
        case 'city':
            check(input, regexCity);
            break;
        case 'email':
            check(input, regexEmail);
            break;
        default:
            break;
    }

    console.log('formulaire valide : ' + valid)
}

(async function sendOrder() {
    const submitButton = document.getElementById('order');
    const contactForm = document.querySelector('.cart__order__form')
    submitButton.addEventListener('click', () => {
        validateForm();
    })

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const contact = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                email: document.getElementById('email').value
            }
            const products = LocalStorageManager.getOrders;

            if (products.length > 0) {
                let cart = products.map((product) => product.id);
                const dataToSend = JSON.stringify({
                    "contact": contact,
                    "products": [...cart]
                })
                const response = await ApiManager("http://localhost:3000/api/products/order", "POST", dataToSend);
                if (response) {
                    response.quantity = products.length;
                    response.total = await total();
                    window.location.href = `confirmation.html?orderId=${response.orderId}&ProductQuantity=${response.quantity}`;
                }

                //debug
                console.log(dataToSend);
                for (let i = 0; i < products.length; i++) {
                    console.log('Procuct n#'+i+ ' ' +products[i].id, ' ',  products[i].colors, ' ', products[i].quantity);
                }
            } else {
                alert("Votre panier est vide");
            }
        }
    })

})();
