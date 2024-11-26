import Handler from '../Handler.js';

/**
 * Minimal Node element of Sql query
 *
 * @abstract
 * @class INode
 * @typedef {INode}
 */
abstract class INode {
  /**
   * Evaluation Function to evaluate the Node to Query
   *
   * @abstract
   * @param {Handler} handler
   * @returns {string}
   */
  abstract eval(handler: Handler): { query: string; args: unknown[] };
}

export default INode;
