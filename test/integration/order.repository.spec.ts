import { Sequelize } from "sequelize-typescript";
import OrderModel from "../../src/infra/order/order.model";
import OrderRepository from "../../src/infra/order/order.repository";
import CustomerModel from "../../src/infra/customer/customer.model";
import OrderItemModel from "../../src/infra/order/order-item.model";
import ProductModel from "../../src/infra/product/product.model";
import CustomerRepository from "../../src/infra/customer/customer.repository";
import Address from "../../src/domain/customer/address";
import ProductRepository from "../../src/infra/product/product.repository";
import Product from "../../src/domain/product/product";
import OrderItem from "../../src/domain/checkout/order_item";
import Customer from "../../src/domain/customer/customer";
import Order from "../../src/domain/checkout/order";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);
    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);
    const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);
    const order = new Order("123", "123", [orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);
    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });
    expect(orderModel!.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });
});