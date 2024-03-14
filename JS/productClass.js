export class Product{
    // Define the Product class
    constructor(name, price) {
      this.name = name;
      this.price = price;
     
    }
  }


export class CartItem {
    constructor(product, quantity = 1) {
      this.product = product;
      this.quantity = quantity;
    }
  }
  