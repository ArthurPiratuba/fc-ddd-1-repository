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


describe.skip("Order repository test challenge", function () {
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

    it("Should find an existing order", async () => {
        let customerRepository = new CustomerRepository();
        let customer = new Customer("id_customer", "Vivente");
        customer.changeAddress(new Address("Rua", 1000, "CEP", "Cidade"));
        customerRepository.create(customer);
        let productRepository = new ProductRepository();
        let product = new Product("id_product", "Uma coisa legal", 10);
        productRepository.create(product);
        let orderRepository = new OrderRepository();
        let item = new OrderItem("id_item", "Uma coisa legal", 10, "id_product", 100);
        let order = new Order("id_order", "id_customer", [item]);
        orderRepository.create(order);
        let savedOrder = await orderRepository.find("id_order");
        expect(savedOrder).toStrictEqual(order);
    });
});