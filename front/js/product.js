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
            //check input size if is > 100 or < 1 yes alert else add to cart
            if (quantity > max || quantity < min) {
                alert('Quantity must be between 1 and 100');
            } else {
                const cart = JSON.parse(localStorage.getItem('orders'));
                const product = cart.find(item => item.id === select.id && item.colors === select.colors);
                //check if product is already in cart and update quantity
                if (product) {
                    product.quantity += select.quantity;
                    //debug
                    alert('Product already in cart, quantity updated : ' + product.quantity);
                } else {
                    cart.push(select);
                    //debug
                    alert('Product added to cart');
                }
                //push in localStorage
                localStorage.setItem('orders', JSON.stringify(cart));
            }
        });
    };
}

load().catch(e => console.log(e));

