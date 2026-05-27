/**
 * Anti-corruption layer for unit_type between the DB and the B2B app.
 *
 * The shared database stores three unit types: studio / single_room /
 * shared_room (migration 20260526000018). Older rows may still carry the
 * legacy one_bedroom / two_bedroom values.
 *
 * B2B internally keys all of its logic (cart slot keys, proposal designer
 * slots, label maps, localStorage cart entries) off `one_bedroom` (= "Single
 * Room") and `shared_room`. Rather than propagate the DB rename through every
 * one of those touch points (and migrate persisted carts), we normalize the
 * DB value onto B2B's internal scheme at the data boundary — exactly as the
 * app already did for two_bedroom -> shared_room.
 *
 *   single_room -> one_bedroom   (B2B's internal key for "Single Room")
 *   two_bedroom -> shared_room
 *
 * Apply toB2BUnitType() to any unit_type read directly from the DB.
 */
const DB_TO_B2B_UNIT_TYPE = {
  single_room: 'one_bedroom',
  two_bedroom: 'shared_room',
};

// unit_type values B2B accepts from the DB (new + legacy).
export const B2B_DB_UNIT_TYPES = [
  'studio',
  'single_room',
  'shared_room',
  'one_bedroom',
  'two_bedroom',
];

export function toB2BUnitType(dbType) {
  return DB_TO_B2B_UNIT_TYPE[dbType] || dbType;
}
