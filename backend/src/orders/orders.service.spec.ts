import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { firestore } from '../firebase/firebase.config';

jest.mock('../firebase/firebase.config', () => ({
  firestore: {
    collection: jest.fn().mockReturnValue({
      add: jest.fn(),
      get: jest.fn(),
      doc: jest.fn().mockReturnValue({
        get: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      }),
    }),
  },
}));

describe('OrdersService', () => {
  let service: OrdersService;
  let mockCollection: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersService],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    mockCollection = firestore.collection('orders');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new order and return it', async () => {
      const createOrderDto: CreateOrderDto = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        price: 100,
        quantity: 2,
      };

      const mockDocRef = { id: 'mock-id' };
      const mockDoc = {
        id: 'mock-id',
        data: jest.fn().mockReturnValue(createOrderDto),
      };

      mockCollection.add.mockResolvedValue(mockDocRef);
      mockCollection.doc.mockReturnValue({
        get: jest.fn().mockResolvedValue(mockDoc),
      });

      const result = await service.create(createOrderDto);

      expect(mockCollection.add).toHaveBeenCalledWith(createOrderDto);
      expect(mockCollection.doc).toHaveBeenCalledWith(mockDocRef.id);
      expect(result).toEqual({ id: 'mock-id', ...createOrderDto });
    });

    it('should throw an InternalServerErrorException on failure', async () => {
      mockCollection.add.mockRejectedValue(new Error('Add failed'));

      await expect(
        service.create({
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          price: 100,
          quantity: 2,
        }),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findAll', () => {
    it('should return all orders', async () => {
      const mockDocs = [
        {
          id: '1',
          data: jest.fn().mockReturnValue({ email: 'test1@example.com' }),
        },
        {
          id: '2',
          data: jest.fn().mockReturnValue({ email: 'test2@example.com' }),
        },
      ];

      mockCollection.get.mockResolvedValue({ docs: mockDocs });

      const result = await service.findAll();

      expect(mockCollection.get).toHaveBeenCalled();
      expect(result).toEqual([
        { id: '1', email: 'test1@example.com' },
        { id: '2', email: 'test2@example.com' },
      ]);
    });

    it('should throw an InternalServerErrorException on failure', async () => {
      mockCollection.get.mockRejectedValue(new Error('Get failed'));

      await expect(service.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOne', () => {
    it('should return the order if it exists', async () => {
      const mockDoc = {
        id: 'mock-id',
        exists: true,
        data: jest.fn().mockReturnValue({ email: 'test@example.com' }),
      };

      mockCollection.doc.mockReturnValue({
        get: jest.fn().mockResolvedValue(mockDoc),
      });

      const result = await service.findOne('mock-id');

      expect(mockCollection.doc).toHaveBeenCalledWith('mock-id');
      expect(result).toEqual({ id: 'mock-id', email: 'test@example.com' });
    });

    it('should throw NotFoundException if the order does not exist', async () => {
      const mockDoc = { exists: false };

      mockCollection.doc.mockReturnValue({
        get: jest.fn().mockResolvedValue(mockDoc),
      });

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw an InternalServerErrorException on failure', async () => {
      mockCollection.doc.mockReturnValue({
        get: jest.fn().mockRejectedValue(new Error('Get failed')),
      });

      await expect(service.findOne('mock-id')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update', () => {
    it('should update an order if it exists', async () => {
      const updateOrderDto: UpdateOrderDto = { price: 200 };

      mockCollection.doc.mockReturnValue({
        get: jest.fn().mockResolvedValue({ exists: true }),
        update: jest.fn().mockResolvedValue(undefined),
      });

      await service.update('mock-id', updateOrderDto);

      expect(mockCollection.doc).toHaveBeenCalledWith('mock-id');
      expect(mockCollection.doc().update).toHaveBeenCalledWith(updateOrderDto);
    });

    it('should throw NotFoundException if the order does not exist', async () => {
      mockCollection.doc.mockReturnValue({
        get: jest.fn().mockResolvedValue({ exists: false }),
      });

      await expect(
        service.update('invalid-id', { price: 200 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw an InternalServerErrorException on failure', async () => {
      mockCollection.doc.mockReturnValue({
        get: jest.fn().mockResolvedValue({ exists: true }),
        update: jest.fn().mockRejectedValue(new Error('Update failed')),
      });

      await expect(service.update('mock-id', { price: 200 })).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('remove', () => {
    it('should delete an order if it exists', async () => {
      mockCollection.doc.mockReturnValue({
        get: jest.fn().mockResolvedValue({ exists: true }),
        delete: jest.fn().mockResolvedValue(undefined),
      });

      await service.remove('mock-id');

      expect(mockCollection.doc).toHaveBeenCalledWith('mock-id');
      expect(mockCollection.doc().delete).toHaveBeenCalled();
    });

    it('should throw NotFoundException if the order does not exist', async () => {
      mockCollection.doc.mockReturnValue({
        get: jest.fn().mockResolvedValue({ exists: false }),
      });

      await expect(service.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw an InternalServerErrorException on failure', async () => {
      mockCollection.doc.mockReturnValue({
        get: jest.fn().mockResolvedValue({ exists: true }),
        delete: jest.fn().mockRejectedValue(new Error('Delete failed')),
      });

      await expect(service.remove('mock-id')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
