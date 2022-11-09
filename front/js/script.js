async function getProducts() {
    // Call API to get products
    await fetch('http://localhost:3000/api/products', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(result => {
            if (result.ok) {
                return result.json();
            }
        })
        .then(
            products => displayProducts(products)
        )
        .catch((err) => {
                console.log(`Error for fetch all products : ${err}`)
            }
        );
}

function displayProducts(products) {
    const parent = document.getElementById("items");

    for (const product of products) {
        //create elements
        const link = document.createElement('a');
        const article = document.createElement('article');
        const title = document.createElement('h3');
        const description = document.createElement('p');
        const image = document.createElement('img');
        parent.appendChild(link);
        link.appendChild(article);
        link.href = `./product.html?id=${product._id}`;
        image.src = product.imageUrl;
        image.alt = product.altTxt;
        title.textContent = product.name;
        title.classList.add('productName');
        description.classList.add('productDescription');
        description.textContent = product.description;
        article.appendChild(image);
        article.appendChild(title);
        article.appendChild(description);
    }
}

getProducts();