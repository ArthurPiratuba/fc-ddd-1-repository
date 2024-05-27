import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../src/infra/customer.model";
import OrderModel from "../../src/infra/order.model";
import OrderItemModel from "../../src/infra/order-item.model";
import ProductModel from "../../src/infra/product.model";
import CustomerRepository from "../../src/infra/customer.repository";
import Customer from "../../src/domain/customer/customer";
import Address from "../../src/domain/customer/address";
import ProductRepository from "../../src/infra/product.repository";
import Product from "../../src/domain/product/product";
import OrderRepository from "../../src/infra/order.repository";
import OrderItem from "../../src/domain/checkout/order_item";
import Order from "../../src/domain/checkout/order";


describe("Order repository test challenge", function () {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });
        await sequelize.addModels([CustomerModel, OrderModel, OrderItemModel, ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should find an existing order", async function () {
        let customerRepository = new CustomerRepository();
        let productRepository = new ProductRepository();
        let orderRepository = new OrderRepository();
        let customer = new Customer("id_customer", "Vivente");
        customer.changeAddress(new Address("Rua", 1000, "CEP", "Cidade"));
        let product = new Product("id_product", "Uma coisa legal", 10);
        let item = new OrderItem("id_item", "Uma coisa legal", 10, "id_product", 100);
        let order = new Order("id_order", "id_customer", [item]);
        await productRepository.create(product);
        await customerRepository.create(customer);
        await orderRepository.create(order);
        let savedOrder = await orderRepository.find("id_order");
        expect(savedOrder).toStrictEqual(order);
    });

    it("should find all existing orders", async function () {
        let customerRepository = new CustomerRepository();
        let productRepository = new ProductRepository();
        let orderRepository = new OrderRepository();
        let customer = new Customer("id_customer", "Vivente");
        customer.changeAddress(new Address("Rua", 1000, "CEP", "Cidade"));
        let product = new Product("id_product", "Uma coisa legal", 10);
        let item1 = new OrderItem("id_item1", "Uma coisa legal", 10, "id_product", 100);
        let item2 = new OrderItem("id_item2", "Uma coisa legal", 10, "id_product", 100);
        let order1 = new Order("id_order1", "id_customer", [item1]);
        let order2 = new Order("id_order2", "id_customer", [item2]);
        await productRepository.create(product);
        await customerRepository.create(customer);
        await orderRepository.create(order1);
        await orderRepository.create(order2);
        let savedOrders = await orderRepository.findAll();
        expect(savedOrders[0]).toMatchObject(order1);
        expect(savedOrders[1]).toMatchObject(order2);
    });

    it("should return an empty array if no orders are found", async function () {
        let orderRepository = new OrderRepository();
        let orders = await orderRepository.findAll();
        expect(orders).toMatchObject([]);
    });

    it("should update an order", async function () {
        let customerRepository = new CustomerRepository();
        let productRepository = new ProductRepository();
        let orderRepository = new OrderRepository();
        let customer = new Customer("id_customer", "Vivente");
        customer.changeAddress(new Address("Rua", 1000, "CEP", "Cidade"));
        let product = new Product("id_product", "Uma coisa legal", 10);
        let item = new OrderItem("id_item", "Uma coisa legal", 10, "id_product", 100);
        let orderBeforeUpdate = new Order("id_order", "id_customer", [item]);
        await productRepository.create(product);
        await customerRepository.create(customer);
        await orderRepository.create(orderBeforeUpdate);
        let savedOrder = await orderRepository.find(orderBeforeUpdate.id);
        savedOrder.updateItem(new OrderItem("id_item", "Uma coisa legal alterada", 2, "id_product", 300));
        await orderRepository.update(savedOrder);
        let updatedOrder = await orderRepository.find(orderBeforeUpdate.id);
        expect(updatedOrder).toMatchObject(savedOrder);
    });
});
