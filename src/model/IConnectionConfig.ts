/**
 * Connection Configuration
 *
 * @interface IConnectionConfig
 * @typedef {IConnectionConfig}
 */
interface IConnectionConfig {
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
   * Username for authentication
   *
   * @type {string}
   */
  username: string;

  /**
   * Password for authentication
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

  /**
   * Maximum number of concurrent connections
   *
   * @type {number | undefined}
   */
  connectionLimit?: number;
}
export default IConnectionConfig;
