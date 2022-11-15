
export class LocalStorageManager {
    constructor(id, quantity) {
        this.id = id;
        this.quantity = quantity;
    }

    static getOrders = JSON.parse(localStorage.getItem('orders'));


    static setOrders(orders) {
        localStorage.setItem('orders', JSON.stringify(orders));
    }


    static find(select) {
        let cart = LocalStorageManager.getOrders;
        cart.find(item => item.id === select.id && item.colors === select.colors);
    }
    //set localstorage empty array
    static clearAll() {
        //better to remove
        localStorage.setItem('orders', JSON.stringify([]));
    }
}

/**
 *
 * @param url required
 * @param method optional default GET
 * @param data optional default null
 * @returns {Promise<Response | void>}
 * @constructor
 * @description fetch function
 * @example
 * const response = await Fetch('http://localhost:3000/api/products', 'GET', null);
 * @example
 * const response = await Fetch('http://localhost:3000/api/products', 'POST', data);
 */
export const ApiManager = async (url, method, data) => {
    return fetch(url, {
        method: method,
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
/**
 * @description get all products or one product by id
 * @param id optional default null
 * @returns {Promise<any>}
 * @constructor ApiManager
 * @example
 * const response = await ApiManager('http://localhost:3000/api/products', 'GET', null);
 * @example
 * const response = await ApiManager('http://localhost:3000/api/products/1', 'GET', null);
 * @example
 * const response = await ApiManager('http://localhost:3000/api/products', 'POST', data);
 */
export const getApi = async (id) => {
    let url = `http://localhost:3000/api/products/${id}`;
    if (id === undefined) {
        url = `http://localhost:3000/api/products`;
    }
    return fetch(url)
        .then(res => res.json())

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
export function createHtmlElement(parent, element, text, href, src, alt, classList) {
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


