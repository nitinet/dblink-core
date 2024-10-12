/**
 * Entity Type
 *
 * @typedef {IEntityType}
 * @template T
 */
type IEntityType<T> = new (...args: unknown[]) => T;

/**
 * Data Type
 *
 * @typedef {DataType}
 */
type DataType = boolean | number | bigint | string | Buffer | Date | Array<unknown>;

export { DataType, IEntityType };
