async function load() {
    await Product.addToCart();
    await Product.displayProduct();
}

export default class Product {
    constructor(Id, color, quantity) {
            this.id = Id,
            this.colors = color,
            this.quantity = quantity
    }

    static getId() {
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);
        if (params.get('id')) {
            return params.get('id');
        } else {
            alert('Aucun produit selectionné');
        }
    }

    static async getProductData() {
        const Id = Product.getId();
        try {
            const response = await fetch(`http://localhost:3000/api/products/${Id}`);
            return await response.json();
        } catch (e) {
            console.log("Erreur lors de l'appel du serveur " + e);
        }
    }

    static async displayProduct() {
        const data = await Product.getProductData();
        document.getElementById('title').textContent = data.name;
        document.getElementById('price').textContent = data.price;
        document.getElementById('description').textContent = data.description;
        document.querySelector('.item__img').innerHTML = `
            <img src="${data.imageUrl}" alt="${data.altTxt}">
        `;

        const colors = data.colors;
        let colorRender = '';
        colors.forEach(item => {
            colorRender += `<option value="${item}">${item}</option>`;
        });
        // injection in html
        document.getElementById('colors').innerHTML = colorRender;
    }

    static async addToCart() {
        const productData = await Product.getProductData();
        const btn = document.querySelector('#addToCart');
        const selectedColor = document.querySelector('#colors');
        const selectedQuantity = document.querySelector('#quantity');

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const max = 10;
            const min = 1;
            const quantity = selectedQuantity.value;
            const select = new Product(
                productData._id,
                selectedColor.value,
                Number(quantity)
            );
            if (select.quantity >= min && select.quantity <= max) {
                let orders = [select];
                if (localStorage.getItem('orders')) {
                    orders = JSON.parse(localStorage.getItem('orders'));
                }
                orders.push(select);
                localStorage.setItem('orders', JSON.stringify(orders));
                alert('Le produit a été ajouté au panier');
            } else {
                alert(`Erreur veuillez selectionnez un nombre d'article(s) entre ${min} et ${max}.`);
            }
        })
    }
};

load();

