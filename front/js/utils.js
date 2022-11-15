/**
 * inspiration : https://github.com/lecturenotes/localstorage-manager/blob/master/js/localstorage-manager.js
 */
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
    //remove all local storage
    static clearAll = function () {
        localStorage.clear();
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


