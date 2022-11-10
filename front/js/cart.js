const storage = JSON.parse(localStorage.getItem('orders'));

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
        displayCart().catch((err) => console.log(err));
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
                    console.log(`Produit id: ${storage[i].id} // color: ${storage[i].colors} supprimé `);
                    console.log(storage);

                }
            }
        });
    }
}

async function updateQuantity() {
    const inputQty = document.querySelectorAll('input.itemQuantity');
    console.log(inputQty);
    for (let input of inputQty) {
        //get id & color of product click
        input.addEventListener('change', (e) => {
            const id = e.target.parentNode.parentNode.parentNode.parentNode.dataset.id;
            const color = e.target.parentNode.parentNode.parentNode.parentNode.dataset.color;
            const qty = e.target.value;
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

function validateForm() {
    const formQuestion = document.querySelectorAll('.cart__order__form__question input');
    let valid = false;

    formQuestion.forEach((input) => {
        validation(input);

        input.addEventListener('input', () => {
            validation(input);
        })
    })
    for (let form of formQuestion) {
        console.log(form);
        valid = !(form.value === "" || form.classList.contains('error'));
        if (!valid) {
            break;
        }
    }
    console.log(valid);

    return valid;
}

function validation(input) {
    const regexFirstName = new RegExp(/^([a-zA-ZÀ-ÿ]{2,26})(-[a-zA-ZÀ-ÿ]{2,26})?(\s[a-zA-ZÀ-ÿ]{2,26})?$/, 'g')
    const regexLastName = new RegExp(/^([a-zA-ZÀ-ÿ]{2,26})(-[a-zA-ZÀ-ÿ]{2,26})?(\s[a-zA-ZÀ-ÿ]{2,26})?$/, 'g')
    const regexAddress = new RegExp(/^([a-zA-ZÀ-ÿ0-9]{2,26})(-[a-zA-ZÀ-ÿ0-9]{2,26})?(\s[a-zA-ZÀ-ÿ0-9]{2,26})?$/, 'g')
    const regexCity = new RegExp(/^([a-zA-ZÀ-ÿ]{2,26})(-[a-zA-ZÀ-ÿ]{2,26})?(\s[a-zA-ZÀ-ÿ]{2,26})?$/, 'g')
    const regexEmail = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'g')

    const err = input.nextElementSibling

    if (input.name === 'firstName') {
        if (regexFirstName.test(input.value)) {
            input.classList.remove('error');
            err.classList.remove('error');
        } else {
            input.classList.add('error');
            err.classList.add('error');
        }
    } else if (input.name === 'lastName') {
        if (regexLastName.test(input.value)) {
            input.classList.remove('error');
            err.classList.remove('error');
        } else {
            input.classList.add('error');
            err.classList.add('error');
        }
    } else if (input.name === 'address') {
        if (regexAddress.test(input.value)) {
            input.classList.remove('error');
            err.classList.remove('error');
        } else {
            input.classList.add('error');
            err.classList.add('error');
        }
    } else if (input.name === 'city') {
        if (regexCity.test(input.value)) {
            input.classList.remove('error');
            err.classList.remove('error');
        } else {
            input.classList.add('error');
            err.classList.add('error');
        }
    } else if (input.name === 'email') {
        if (regexEmail.test(input.value)) {
            input.classList.remove('error');
            err.classList.remove('error');
            console.log('ok');
        } else {
            console.log('form pas ok');
            input.classList.add('error');
            err.classList.add('error');
        }
    } else {
        input.classList.add('error');
        err.classList.add('error');
    }
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
                console.log(response);

                if (response) {
                    localStorage.clear();
                    window.location.href = `confirmation.html?orderId=${response.orderId}`;
                }

            } else {
                alert("Votre panier est vide");
            }
        }
    })

})();
