const storage = JSON.parse(localStorage.getItem('orders'));
let valid = false;

//request data from api
async function getProductData(id) {
    try {
        const response = await fetch(`http://localhost:3000/api/products/${id}`);
        return response.json();
    } catch (e) {
        alert("Error " + e);
    }
}

//control page
(function load() {
    if (storage == null || storage.length === 0) {
        empty().catch((err) => console.log(err));
    } else if (storage !== 0) {
        //si il n'est pas vide
        displayCart().then(() => console.log('produit affichié')).catch((err) => console.log(err));
        total().catch((err) => console.log(err));
        setTimeout(() => {
            removeProductInCart().catch((err) => console.log(err));
            updateQuantity().catch((err) => console.log(err));
        }, 1000);
    }
})();

//get total price & total quantity articles
async function total() {
    let qty = 0;
    let amt = 0;
    let add;
    if (storage !== 0) {
        for (let item of storage) {
            qty += Number(item.quantity);
            const data = await getProductData(item.id);
            add = item.quantity * data.price;
            amt += add;
        }
    }
    document.querySelector('#totalQuantity').innerHTML = qty;
    document.querySelector('#totalPrice').innerHTML = amt;
}

async function empty() {
    document.querySelector('#empty').innerHTML = `<p>Votre panier est vide :( <br/><a href="index.html">Home</a></p>`;
    document.querySelector('.cart').hidden = true;
}

async function displayCart() {
    let render = "";
    for (let item of storage) {
        //check size of product
        if (item.quantity >= 1 && item.quantity <= 100) {
            item.quantity = Number(item.quantity);
        } else if (item.quantity > 100) {
            //if quantity > 100 => set quantity = 100
           item.quantity = 100;
            localStorage.setItem('orders', JSON.stringify(storage));
        } else {
            //if quantity < 1 => set quantity = 1
            item.quantity = 1;
            localStorage.setItem('orders', JSON.stringify(storage));
        }

        const data = await getProductData(item.id);

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
            const id = e.target.parentNode.parentNode.parentNode.parentNode.dataset.id;
            const color = e.target.parentNode.parentNode.parentNode.parentNode.dataset.color;
            //remove product in storage
            //reload page if cart is empty
            for (let i = 0; i < storage.length; i++) {
                //if id & color are the same in storage & input => remove product in storage
                if (storage[i].id === id && storage[i].colors === color) {
                    storage.splice(i, 1);
                    localStorage.setItem('orders', JSON.stringify(storage));
                    const article = e.target.parentNode.parentNode.parentNode.parentNode;
                    article.remove();
                    total().catch((err) => console.log(err));
                    //reload page if cart is empty
                    if (storage.length === 0) {
                        window.location.reload();
                    }
                    //debug
                    console.log(`Produit remove : ${id} - ${color}`);
                    console.log(storage);
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
            const id = e.target.parentNode.parentNode.parentNode.parentNode.dataset.id;
            const color = e.target.parentNode.parentNode.parentNode.parentNode.dataset.color;
            const qty = e.target.value
            //debug
            console.log(`product quantity edit // qty: ${qty} - id: ${id} - color: ${color}`);
            for (let i = 0; i < storage.length; i++) {
                //if id & color are the same in storage & input => update quantity in storage
                if (storage[i].id === id && storage[i].colors === color) {
                    //check if value is between 1 & 100
                    if (qty >= 1 && qty <= 100) {
                        storage[i].quantity = qty;
                        localStorage.setItem('orders', JSON.stringify(storage));
                        total().catch((err) => console.log(err));
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

    console.log('formulaire valide : ' +valid)
}

function getLocalStorage() {
    let ordersInLocalStorage = localStorage.getItem("orders")

    return ordersInLocalStorage != null ? JSON.parse(ordersInLocalStorage) : []
}

function sendDataOrder(data) {
    return fetch('http://localhost:3000/api/products/order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: data
    }).then(res => {
        if (res.ok) {
            return res.json();
        }
    }).catch(err => console.log(err));
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
            const products = getLocalStorage();

            if (products.length > 0) {
                let cart = products.map((product) => product.id);
                const dataToSend = JSON.stringify({
                    "contact": contact,
                    "products": cart
                })
                const response = await sendDataOrder(dataToSend);
                if (response) {
                    localStorage.clear();
                    window.location.href = `confirmation.html?orderId=${response.orderId}`;
                }

                //debug
                console.log(dataToSend);
                console.log("Panier => " + cart);
            } else {
                alert("Votre panier est vide");
            }
        }
    })

})();
