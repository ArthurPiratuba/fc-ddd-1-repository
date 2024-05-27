import Order from "../domain/checkout/order";
import OrderRepositoryInterface from "../domain/checkout/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderItem from "../domain/checkout/order_item";
import { Transaction } from "sequelize";

export default class OrderRepository implements OrderRepositoryInterface {

  async update(entity: Order): Promise<void> {
    const transaction: Transaction = await OrderModel.sequelize.transaction();
    try {
      const orderModel = await OrderModel.findOne({
        where: { id: entity.id },
        include: OrderItemModel,
        transaction,
      });
      if (!orderModel) throw new Error("Order not found");
      orderModel.customer_id = entity.customerId;
      await orderModel.save({ transaction });
      const orderItems = entity.items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        productId: item.productId,
        quantity: item.quantity,
        orderId: entity.id,
      }));
      await Promise.all(orderItems.map(async (item) => {
        const existingItem = await OrderItemModel.findOne({ where: { id: item.id }, transaction });
        if (existingItem)
          await existingItem.update(item, { transaction });
        else
          await OrderItemModel.create(item, { transaction });
      }));
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async find(id: string): Promise<Order> {
    let orderModel;
    try {
      orderModel = await OrderModel.findOne({
        where: { id },
        include: OrderItemModel,
        rejectOnEmpty: true
      });
    } catch (error) {
      throw new Error("Order not found")
    }
    const items: OrderItem[] = [];
    for (let orderItemModel of orderModel.items) {
      let orderItem = new OrderItem(
        orderItemModel.id,
        orderItemModel.name,
        orderItemModel.price,
        orderItemModel.product_id,
        orderItemModel.quantity
      )
      items.push(orderItem);
    }
    const order = new Order(id, orderModel.customer_id, items);
    return order;
  }

  async findAll(): Promise<Order[]> {
    let orderModels = await OrderModel.findAll({ include: OrderItemModel });
    let orders: Order[] = [];
    for (let orderModel of orderModels) {
      const items: OrderItem[] = [];
      for (let orderItemModel of orderModel.items) {
        let orderItem = new OrderItem(
          orderItemModel.id,
          orderItemModel.name,
          orderItemModel.price,
          orderItemModel.product_id,
          orderItemModel.quantity
        )
        items.push(orderItem);
      }
      const order = new Order(orderModel.id, orderModel.customer_id, items);
      orders.push(order);
    }
    return orders;
  }

  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total,
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }
}
