import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './interfaces/order.interface';
import { firestore } from '../firebase/firebase.config';

@Injectable()
export class OrdersService {
  private readonly collection = firestore.collection('orders');

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      const docRef: any = await this.collection.add(createOrderDto);

      const doc = await this.collection.doc(docRef.id).get();
      return { id: doc.id, ...doc.data() } as Order;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create order: ${error.message}`,
      );
    }
  }

  async findAll(): Promise<Order[]> {
    try {
      const snapshot = await this.collection.get();
      return snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as Order,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to get all orders: ${error.message}`,
      );
    }
  }

  async findOne(id: string): Promise<Order> {
    try {
      const doc = await this.collection.doc(id).get();
      if (!doc.exists) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }
      return { id: doc.id, ...doc.data() } as Order;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to get order by ID ${id}: ${error.message}`,
      );
    }
  }

  async update(
    id: string,
    updateOrderDto: Partial<UpdateOrderDto>,
  ): Promise<void> {
    try {
      const doc = await this.collection.doc(id).get();
      if (!doc.exists) {
        throw new NotFoundException(`Order with iD ${id} not found`);
      }
      await this.collection.doc(id).update(updateOrderDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to update order with ID ${id}: ${error.message}`,
      );
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const doc = await this.collection.doc(id).get();
      if (!doc.exists) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }
      await this.collection.doc(id).delete();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to delete order with ID ${id}: ${error.message}`,
      );
    }
  }
}
