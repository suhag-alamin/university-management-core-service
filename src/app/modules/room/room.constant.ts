export const RoomFilterableFields = ['searchTerm', 'id', 'buildingId'];
export const RoomSearchableFields = ['roomNumber', 'floor'];

export const roomRelationalFields: string[] = ['buildingId'];
export const roomRelationalFieldsMapper: { [key: string]: string } = {
  buildingId: 'building',
};
