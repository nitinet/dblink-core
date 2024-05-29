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
  id: any = null;
  /**
   * Description placeholder
   *
   * @type {any[]}
   */
  rows: any[] = [];
  /**
   * Description placeholder
   *
   * @type {(string | null)}
   */
  error: string | null = null;
}
