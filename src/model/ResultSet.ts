/**
 * Description placeholder
 *
 * @export
 * @class ResultSet
 * @typedef {ResultSet}
 */
export default class ResultSet {
  /**
   * Description placeholder
   *
   * @type {number}
   */
  rowCount: number = 0;
  /**
   * Description placeholder
   *
   * @type {*}
   */
  id: unknown = null;
  /**
   * Description placeholder
   *
   * @type {Record<string, unknown>[]}
   */
  rows: Record<string, unknown>[] = [];
  /**
   * Description placeholder
   *
   * @type {(string | null)}
   */
  error: string | null = null;
}
