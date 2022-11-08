//------Modele d'objet pour les produits selectionnes
async function main() {
    await product.addToCart()
        .then(r => { console.log(r)});
    await product.displayProduct()
        .then(r => console.log(r));
}

class product {
    constructor(productId, color, quantity) {
            this.id = productId,
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
        const productId = product.getId();
        try {
            const response = await fetch(`http://localhost:3000/api/products/${productId}`);
            // convertion de la reponse au format json
            return await response.json();
        } catch (e) {
            console.log("Erreur lors de l'appel du serveur " + e);
            alert("Erreur lors de l'appel du serveur ");
        }
    }

    static async displayProduct() {
        const data = await product.getProductData();
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
        // injection du rendu dans l'html
        document.getElementById('colors').innerHTML = colorRender;
    }

    static async addToCart() {
        const productData = await product.getProductData();
        const btn = document.querySelector('#addToCart');
        const selectedColor = document.querySelector('#colors');
        const selectedQuantity = document.querySelector('#quantity');

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const min = 1;
            const max = 100;
            const select = new product(
                productData._id,
                selectedColor.value,
                Number(selectedQuantity.value)
            );
            if (select.quantity >= min && select.quantity <= max) {
                let orders = [select];
                if (localStorage.getItem('orders')) {
                    orders = JSON.parse(localStorage.getItem('orders'));
                }
                orders.push(select);
                localStorage.setItem('orders', JSON.stringify(orders));
                alert('Produit ajouté au panier');

            } else {
                alert(`selectionnez entre ${min} et ${max} produits`);
            }
        })
    }
};

main();

