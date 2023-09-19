export const RoomFilterableFields = ['searchTerm', 'id', 'buildingId'];
export const RoomSearchableFields = ['roomNumber', 'floor'];

export const roomRelationalFields: string[] = ['buildingId'];
export const roomRelationalFieldsMapper: { [key: string]: string } = {
  buildingId: 'building',
};

export const eventRoomCreated = 'room.created';
export const eventRoomUpdated = 'room.updated';
export const eventRoomDeleted = 'room.deleted';
