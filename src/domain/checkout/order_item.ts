export default class OrderItem {
  
  constructor(
    readonly id: string,
    readonly name: string,
    readonly price: number,
    readonly productId: string,
    readonly quantity: number
  ) { }

  total(): number {
    return this.price * this.quantity;
  }
}
