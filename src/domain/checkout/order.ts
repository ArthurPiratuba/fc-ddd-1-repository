import OrderItem from "./order_item";

export default class Order {

  constructor(
    readonly id: string,
    readonly customerId: string,
    readonly items: OrderItem[]
  ) {
    this.validate();
  }

  validate(): boolean {
    if (this.id.length === 0) throw new Error("Id is required");
    if (this.customerId.length === 0) throw new Error("CustomerId is required");
    if (this.items.length === 0) throw new Error("Items are required");
    if (this.items.some((item) => item.quantity <= 0)) throw new Error("Quantity must be greater than 0");
    return true;
  }

  total(): number {
    return this.items.reduce((acc, item) => acc + item.total(), 0);
  }
}
