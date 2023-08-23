import { Room } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { RoomService } from './room.service';
import { RoomFilterableFields } from './room.constant';

const createRoomController = catchAsync(async (req: Request, res: Response) => {
  const result = await RoomService.createRoom(req.body);

  sendResponse<Room>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Room created successfully!',
    data: result,
  });
});

const getRoomsController = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, RoomFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await RoomService.getAllRooms(filters, paginationOptions);

  sendResponse<Room[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Rooms fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});
const getSingleRoomController = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await RoomService.getSingleRoom(id);

    sendResponse<Room>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Room fetched successfully',
      data: result,
    });
  }
);

const updateRoomController = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await RoomService.updateRoom(id, data);

  sendResponse<Room>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Room updated successfully',
    data: result,
  });
});
const deleteRoomController = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await RoomService.deleteRoom(id);

  sendResponse<Room>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Room deleted successfully',
    data: result,
  });
});

export const RoomController = {
  createRoomController,
  getRoomsController,
  getSingleRoomController,
  updateRoomController,
  deleteRoomController,
};
