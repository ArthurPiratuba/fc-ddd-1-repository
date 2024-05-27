import Order from "../../src/domain/checkout/order";
import OrderItem from "../../src/domain/checkout/order_item";

describe("Order unit tests", () => {

  it("should throw error when id is empty", () => {
    expect(() => new Order("", "123", [])).toThrowError("Id is required");
  });

  it("should throw error when customerId is empty", () => {
    expect(() => new Order("123", "", [])).toThrowError("CustomerId is required");
  });

  it("should throw error when customerId is empty", () => {
    expect(() => new Order("123", "123", [])).toThrowError("Items are required");
  });

  it("should calculate total", () => {
    const item = new OrderItem("i1", "Item 1", 100, "p1", 2);
    const item2 = new OrderItem("i2", "Item 2", 200, "p2", 2);
    const order = new Order("o1", "c1", [item]);
    let total = order.total;
    expect(order.total).toBe(200);
    const order2 = new Order("o1", "c1", [item, item2]);
    total = order2.total;
    expect(total).toBe(600);
  });

  it("should throw error if the item qte is less or equal zero 0", () => {
    expect(() => {
      const item = new OrderItem("i1", "Item 1", 100, "p1", 0);
      new Order("o1", "c1", [item]);
    }).toThrowError("Quantity must be greater than 0");
  });

  it("should update an item on order", function () {
    const order = new Order("order_id", "customer_id", [
      new OrderItem("item_id1", "Item 1", 100, "product", 10),
      new OrderItem("item_id2", "Item 2", 200, "product", 20)
    ]);
    expect(order.items[0].quantity).toBe(10);
    expect(order.total).toBe(5000);
    order.updateItem(new OrderItem("item_id1", "Item 1", 100, "product", 50));
    expect(order.items[0].quantity).toBe(50);
    expect(order.total).toBe(9000);
  });

  it("should throw an error if updated item no exists", function () {
    const order = new Order("order_id", "customer_id", [
      new OrderItem("item_id1", "Item 1", 100, "product", 10)
    ]);
    expect(() => order.updateItem(new OrderItem("item_id5", "Item 5", 5000, "product", 10))).toThrow("Item does not exists");
  });

});
