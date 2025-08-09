export class Cart {
  #cartItems;
  #localStorageKey;

  constructor(localStorageKey) {
    this.#localStorageKey = localStorageKey;
    this.#cartItems = JSON.parse(localStorage.getItem(this.#localStorageKey)) || [];
  }

  addToCart(productId, quantity) {
    let productExists = false;
    let indexInCart;

    this.#cartItems.forEach((itemInCart, index) => {
      if (itemInCart.productId === productId) {
        productExists = true;
        indexInCart = index;
      }
    });

    productExists ? this.#cartItems[indexInCart].quantity += quantity : this.#cartItems.push({
      productId,
      quantity,
      deliveryOptionId: '0'
    });

    this.#saveCartItems();
  }

  removeFromCart(productId) {
    this.#cartItems.forEach((itemInCart, index) => {
      if (itemInCart.productId === productId)
        this.#cartItems.splice(index, 1);
    });

    this.#saveCartItems();
  }

  updateQuantiy(productId, newQuantity) {
    this.#cartItems.forEach((itemInCart) => {
      if (itemInCart.productId === productId) {
        if (newQuantity === 0)
          removeFromCart(productId);
        else
          itemInCart.quantity = newQuantity;
      }
    });

    this.#saveCartItems();
  }

  updateDeliveryOption(productId, deliveryOptionId) {
    this.#cartItems.forEach((item) => {
      if (item.productId === productId)
        item.deliveryOptionId = deliveryOptionId;
    });

    this.#saveCartItems();
  }

  #saveCartItems() {
    localStorage.setItem('cart', JSON.stringify(this.#cartItems));
  }

  getCartItems(){
    return this.#cartItems;
  }
}