const storage = JSON.parse(localStorage.getItem('orders'));
console.log(storage);

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
    if (storage.length === 0) {
        empty().catch((err) => console.log(err));
    } else {
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

//create empty cart
async function empty() {
    if (storage.length === 0) {
        document.querySelector('#empty').innerHTML = `<p>Votre panier est vide :( <br/><a href="index.html">Home</a></p>`;
        document.querySelector('.cart').hidden = true;
    }
}

async function displayCart() {
    let render = "";
    for (let item of storage) {
        if (item.quantity >= 1 && item.quantity <= 100) {
            item.quantity = Number(item.quantity);
        } else if (item.quantity > 100) {
            item.quantity = 100;
            localStorage.setItem('orders', JSON.stringify(storage));
        } else {
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
                if (storage[i].id === id && storage[i].colors === color) {
                    console.log(storage[i]);
                    storage.splice(i, 1);
                    localStorage.setItem('orders', JSON.stringify(storage));
                    console.log(storage);
                    const article = e.target.parentNode.parentNode.parentNode.parentNode;
                    article.remove();
                    total().catch((err) => console.log(err));
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
    console.log(inputQty);
    for (let input of inputQty) {
        //get id & color of product click
        input.addEventListener('change', (e) => {
            const id = e.target.parentNode.parentNode.parentNode.parentNode.dataset.id;
            const color = e.target.parentNode.parentNode.parentNode.parentNode.dataset.color;
            const qty = e.target.value;
            console.log(id, color, qty);
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

