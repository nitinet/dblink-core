/**
 * Description placeholder
 *
 * @interface IConnectionConfig
 * @typedef {IConnectionConfig}
 */
interface IConnectionConfig {
  /**
   * Description placeholder
   *
   * @type {?number}
   */
  connectionLimit?: number;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  host: string;
  /**
   * Description placeholder
   *
   * @type {number}
   */
  port: number;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  username: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  password: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  database: string;
}
export default IConnectionConfig;
