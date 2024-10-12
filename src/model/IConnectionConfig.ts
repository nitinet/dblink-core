/**
 * Connection Configuration
 *
 * @interface IConnectionConfig
 * @typedef {IConnectionConfig}
 */
interface IConnectionConfig {
  /**
   * Max number of connections
   *
   * @type {?number}
   */
  connectionLimit?: number;
  /**
   * Hostname of the connection
   *
   * @type {string}
   */
  host: string;
  /**
   * Connection Port
   *
   * @type {number}
   */
  port: number;
  /**
   * Username
   *
   * @type {string}
   */
  username: string;
  /**
   * Password
   *
   * @type {string}
   */
  password: string;
  /**
   * Database Name
   *
   * @type {string}
   */
  database: string;
}
export default IConnectionConfig;
