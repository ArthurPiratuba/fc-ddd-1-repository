import OrderItem from "./order_item";
export default class Order {
  private _id: string;
  private _customerId: string;
  private _items: OrderItem[];
  private _total: number;

  constructor(id: string, customerId: string, items: OrderItem[]) {
    this._id = id;
    this._customerId = customerId;
    this._items = items;
    this._total = this.calculateTotal();
    this.validate();
  }

  get id(): string {
    return this._id;
  }

  get customerId(): string {
    return this._customerId;
  }

  get items(): OrderItem[] {
    return this._items;
  }

  get total(): number {
    return this._total;
  }

  validate(): boolean {
    if (this._id.length === 0) throw new Error("Id is required");
    if (this._customerId.length === 0) throw new Error("CustomerId is required");
    if (this._items.length === 0) throw new Error("Items are required");
    if (this._items.some((item) => item.quantity <= 0)) throw new Error("Quantity must be greater than 0");
    return true;
  }

  updateItem(item: OrderItem) {
    const indexFound = this.items.findIndex(i => i.id === item.id);
    if (indexFound == -1) throw new Error("Item does not exists");
    this.items[indexFound] = item;
    this._total = this.calculateTotal();
    this.validate();
  }

  private calculateTotal(): number {
    return this._items.reduce((acc, item) => acc + item.total(), 0);
  }
}
