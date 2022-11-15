import {getApi} from "./utils.js";

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
/**
 *
 * @param parent optional {HTMLElement} parent element
 * @param element required {HTMLElement} ex : 'div','p','a','img'
 * @param text optional {String} ex : 'lorem ipsum'
 * @param href optional {String} ex : 'http://www.google.com'
 * @param src optional {String} ex : 'http://www.google.com/image.jpg'
 * @param alt optional {String} ex : 'lorem ipsum'
 * @param classList optional {String} ex : 'lorem ipsum'
 * @returns {HTMLElement}
 * @description create an html element with text, href, src, alt, classList
 * @example                parent,     element, text,        href,                   src,                              alt,            classList
 *  EX: createHtmlElement(document.body,'div','lorem ipsum','http://www.google.com','http://www.google.com/image.jpg','lorem ipsum','lorem ipsum');
 */
function createHtmlElement(parent, element, text, href, src, alt, classList) {
    const emt = document.createElement(element);
    //add params if exist in function
    for (let i = 0; i < arguments.length; i++) {
        if (arguments[i] !== null) {
            emt.innerText = text;
            emt.href = href;
            emt.src = src;
            emt.alt = alt;
            emt.classList.add(classList);
        }
        if (parent) {
            parent.appendChild(emt);
        } else {
            return emt;
        }
    }
    return emt;
}

