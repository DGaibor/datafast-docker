import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  const mockOrdersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call OrdersService.create and return the result', async () => {
      const createOrderDto: CreateOrderDto = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        price: 100,
        quantity: 2,
      };

      const mockOrder = { id: 'mock-id', ...createOrderDto };
      mockOrdersService.create.mockResolvedValue(mockOrder);

      const result = await controller.create(createOrderDto);

      expect(service.create).toHaveBeenCalledWith(createOrderDto);
      expect(result).toEqual(mockOrder);
    });

    it('should throw an exception if service fails', async () => {
      mockOrdersService.create.mockRejectedValue(
        new InternalServerErrorException('Failed to create order'),
      );

      await expect(
        controller.create({
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
    it('should call OrdersService.findAll and return the result', async () => {
      const mockOrders = [
        { id: '1', email: 'test1@example.com', price: 50 },
        { id: '2', email: 'test2@example.com', price: 75 },
      ];

      mockOrdersService.findAll.mockResolvedValue(mockOrders);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockOrders);
    });

    it('should throw an exception if service fails', async () => {
      mockOrdersService.findAll.mockRejectedValue(
        new InternalServerErrorException('Failed to fetch orders'),
      );

      await expect(controller.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOne', () => {
    it('should call OrdersService.findOne and return the result', async () => {
      const mockOrder = {
        id: 'mock-id',
        email: 'test@example.com',
        price: 100,
      };

      mockOrdersService.findOne.mockResolvedValue(mockOrder);

      const result = await controller.findOne('mock-id');

      expect(service.findOne).toHaveBeenCalledWith('mock-id');
      expect(result).toEqual(mockOrder);
    });

    it('should throw NotFoundException if the order does not exist', async () => {
      mockOrdersService.findOne.mockRejectedValue(
        new NotFoundException('Order not found'),
      );

      await expect(controller.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw an InternalServerErrorException if service fails', async () => {
      mockOrdersService.findOne.mockRejectedValue(
        new InternalServerErrorException('Failed to fetch order'),
      );

      await expect(controller.findOne('mock-id')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update', () => {
    it('should call OrdersService.update and return the result', async () => {
      const updateOrderDto: UpdateOrderDto = { price: 200 };

      mockOrdersService.update.mockResolvedValue(undefined);

      const result = await controller.update('mock-id', updateOrderDto);

      expect(service.update).toHaveBeenCalledWith('mock-id', updateOrderDto);
      expect(result).toBeUndefined();
    });

    it('should throw NotFoundException if the order does not exist', async () => {
      mockOrdersService.update.mockRejectedValue(
        new NotFoundException('Order not found'),
      );

      await expect(
        controller.update('invalid-id', { price: 200 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw an InternalServerErrorException if service fails', async () => {
      mockOrdersService.update.mockRejectedValue(
        new InternalServerErrorException('Failed to update order'),
      );

      await expect(
        controller.update('mock-id', { price: 200 }),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('remove', () => {
    it('should call OrdersService.remove and return the result', async () => {
      mockOrdersService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('mock-id');

      expect(service.remove).toHaveBeenCalledWith('mock-id');
      expect(result).toBeUndefined();
    });

    it('should throw NotFoundException if the order does not exist', async () => {
      mockOrdersService.remove.mockRejectedValue(
        new NotFoundException('Order not found'),
      );

      await expect(controller.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw an InternalServerErrorException if service fails', async () => {
      mockOrdersService.remove.mockRejectedValue(
        new InternalServerErrorException('Failed to delete order'),
      );

      await expect(controller.remove('mock-id')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
