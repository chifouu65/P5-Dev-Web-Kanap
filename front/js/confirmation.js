import {LocalStorageManager} from "./utils.js";


function urlOrderParams() {
    // Get the order ID from the URL
    let url = new URL(window.location.href);
    let params = new URLSearchParams(url.search);

    //if there is an order ID in the URL, return it
    if (params.get('orderId')) {
        const orderId = params.get('orderId');
        return orderId;
    } else {
        alert('Order Id not found');
    }
}


// Get the order ID  from the URL and display order in the HTML
(async function load() {
    const order = urlOrderParams();
    try {
        document.querySelector('#orderId').textContent = order;
    }catch (error) {
        console.log(error);
    } finally {
        LocalStorageManager.clearAll();
    }
})();