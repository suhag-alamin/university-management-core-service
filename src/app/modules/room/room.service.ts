import { Room, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { IRoomFilters } from './room.interface';
import { RoomSearchableFields } from './room.constant';

const createRoom = async (data: Room): Promise<Room> => {
  const result = await prisma.room.create({
    data,
    include: {
      building: true,
    },
  });
  return result;
};

const getAllRooms = async (
  filters: IRoomFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Room[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      OR: RoomSearchableFields.map(filed => ({
        [filed]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andCondition.push({
      AND: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const whereCondition: Prisma.RoomWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.room.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : {
            createdAt: 'desc',
          },
  });

  const total = await prisma.room.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleRoom = async (id: string): Promise<Room | null> => {
  const result = await prisma.room.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateRoom = async (
  id: string,
  data: Partial<Room>
): Promise<Room | null> => {
  const result = await prisma.room.update({
    where: {
      id,
    },
    data,
  });
  return result;
};

const deleteRoom = async (id: string): Promise<Room | null> => {
  const result = await prisma.room.delete({
    where: {
      id,
    },
  });
  return result;
};

export const RoomService = {
  createRoom,
  getAllRooms,
  getSingleRoom,
  updateRoom,
  deleteRoom,
};
