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
            console.log(select);
            //check input size if is > 100 or < 1 yes alert else add to cart
            if (quantity > max || quantity < min) {
                alert('Quantity must be between 1 and 100');
            } else {
                //check if  product is already in cart if yes add quantity and update cart else add product to cart
                if (localStorage.getItem('orders')) {
                    const cart = JSON.parse(localStorage.getItem('orders'));
                    const index = cart.findIndex(item => item.id === select.id && item.colors === select.colors);
                    if (index > -1) {
                        //check if quantity is > 100 if yes alert else add quantity and update cart
                        if (cart[index].quantity + select.quantity > max) {
                            alert('Quantity max = 100' + ' ' + ', Quantity in cart = ' + cart[index].quantity);
                        } else {
                            cart[index].quantity += select.quantity;
                            localStorage.setItem('orders', JSON.stringify(cart));
                            console.log('product edit to cart');
                        }
                    } else {
                        cart.push(select);
                    }
                    //debug
                    alert('Product add to cart');
                    console.log('Push product to cart');
                    localStorage.setItem('orders', JSON.stringify(cart));
                } else {
                    const cart = [];
                    cart.push(select);
                    localStorage.setItem('orders', JSON.stringify(cart));
                }

            }
        });
    };
}


load().then(() => console.log("Page loaded")).catch(e => console.log(e));

