export function getLocalStorageItem() {
    const ordersInLocalStorage = localStorage.getItem('orders');

    return ordersInLocalStorage ? JSON.parse(ordersInLocalStorage) : [];
}

// calcul total quantity and display

export function displayTotalQuantity() {

    const card = getLocalStorageItem();

}