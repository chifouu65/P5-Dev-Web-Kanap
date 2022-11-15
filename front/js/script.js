import {getApi, createHtmlElement} from "./utils.js";

getApi().then(data => {
    displayProducts(data);
}).catch(error => {
    console.log(error);
});

/**
 * @param products {Array} required {[Object]} ex : products
 * @description display [] of products in html page
 */
function displayProducts(products) {
    /**
     *   <a href="./product.html?id=42">
     *     <article>
     *       <img src=".../product01.jpg" alt="Lorem ipsum dolor sit amet, Kanap name1">
     *       <h3 class="productName">Kanap name1</h3>
     *       <p class="productDescription">Dis enim malesuada risus sapien gravida nulla nisl arcu.
     *          Dis enim malesuada risus sapien gravida nulla nisl arcu.</p>
     *     </article>
     *   </a>
     */
    const parent = document.getElementById("items");
    for (let product of products) {
        const link = createHtmlElement(parent, 'a', null, `./product.html?id=${product._id}`, null, null, null);
        const article = createHtmlElement(link, 'article', null, null, null, null, null);
        createHtmlElement(article, 'img', null, null, product.imageUrl, product.altTxt);
        createHtmlElement(article, 'h3', product.name, null, null, null, 'productName');
        createHtmlElement(article, 'p', product.description, null, null, null, 'productDescription');
        for (let i = 0; i < 3; i++) {
            const p = document.createElement('p');
            article.appendChild(p);
            p.textContent = product.colors[i];
        }
        parent.appendChild(link);
        console.log(link);
    }
}

