import { Building, Prisma } from '@prisma/client';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import {
  buildingSearchableFields,
  eventBuildingCreated,
  eventBuildingDeleted,
  eventBuildingUpdated,
} from './building.constant';
import { IBuildingFilters } from './building.interface';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { RedisClient } from '../../../shared/redis';

const createBuilding = async (data: Building): Promise<Building> => {
  const result = await prisma.building.create({
    data,
  });
  if (result) {
    await RedisClient.publish(eventBuildingCreated, JSON.stringify(result));
  }
  return result;
};

const getAllBuildings = async (
  filters: IBuildingFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Building[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      OR: buildingSearchableFields.map(filed => ({
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

  const whereCondition: Prisma.BuildingWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.building.findMany({
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

  const total = await prisma.building.count();

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleBuilding = async (id: string): Promise<Building | null> => {
  const result = await prisma.building.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateBuilding = async (
  id: string,
  data: Partial<Building>
): Promise<Building | null> => {
  const result = await prisma.building.update({
    where: {
      id,
    },
    data,
  });

  if (result) {
    await RedisClient.publish(eventBuildingUpdated, JSON.stringify(result));
  }
  return result;
};

const deleteBuilding = async (id: string): Promise<Building | null> => {
  const result = await prisma.building.delete({
    where: {
      id,
    },
  });
  if (result) {
    await RedisClient.publish(eventBuildingDeleted, JSON.stringify(result));
  }
  return result;
};

export const BuildingService = {
  createBuilding,
  getAllBuildings,
  getSingleBuilding,
  updateBuilding,
  deleteBuilding,
};
