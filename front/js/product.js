async function load() {
    await Product.addToCart();
    await Product.displayProduct();
}

class Product {
    constructor(Id, color, quantity) {
        this.id = Id;
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
        const Id = Product.getId();
        try {
            const response = await fetch(`http://localhost:3000/api/products/${Id}`);
            return response.json();
        } catch (e) {
            alert("Error " + e);
        }
    };

    static async displayProduct() {
        const data = await Product.getProductData();
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
        console.log(`product data : ${data._id},name: ${data.name}, price: ${data.price}, description: ${data.description}, image: ${data.imageUrl}, alt: ${data.altTxt}`);
    };

    static async addToCart() {
        const productData = await Product.getProductData();
        const btn = document.querySelector('#addToCart');
        const selectedColor = document.querySelector('#colors');
        const selectedQuantity = document.querySelector('#quantity');

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const max = 100;
            const min = 1;
            const quantity = selectedQuantity.value;
            const select = new Product(
                productData._id,
                selectedColor.value,
                Number(quantity)
            );
            if (select.quantity >= min && select.quantity <= max) {
                //check if new product is already in cart
                const order = JSON.parse(localStorage.getItem('orders'));
                if (order) {
                    //get product with same id and color
                    const product = order.find(item => item.id === select.id && item.colors === select.colors);
                    if (product) {
                        //check if quantity is not over 100
                        if (product.quantity + select.quantity <= max) {
                            product.quantity += select.quantity;
                            localStorage.setItem('orders', JSON.stringify(order));
                            console.log(product.quantity)
                            alert('Product already in cart, quantity updated : ' + product.quantity );
                            //set quantity to max
                        } else {
                            //edt quantity to max
                            product.quantity = max;
                            localStorage.setItem('orders', JSON.stringify(order));
                            console.log(`product quantity updated to ${max} / quantity: ${product.quantity}`);
                            alert(`You can't add more than ${max} items`);

                        }
                    } else {
                        order.push(select);
                        localStorage.setItem('orders', JSON.stringify(order));
                        console.log(`Produit ajouté au panier : ${JSON.stringify(select)}`);
                        alert(`Product added to cart / id: ${select.id} / color: ${select.colors} / quantity: ${select.quantity}`);

                    }
                }
            } else {
                alert(`Erreur veuillez selectionnez un nombre d'article(s) entre ${min} et ${max}.`);
            }
        });
    };
}


load().then(() => console.log("Page loaded")).catch(e => console.log(e));

