/**
 * Result data from connection
 *
 * @export
 * @class ResultSet
 * @typedef {ResultSet}
 */
export default class ResultSet {
  /**
   * Rows Data
   *
   * @type {Record<string, unknown>[]}
   */
  rows: Record<string, unknown>[] = [];

  /**
   * Error message
   *
   * @type {(string | null)}
   */
  error: string | null = null;
}
