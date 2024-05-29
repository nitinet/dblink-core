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
   * Arguments of Node
   *
   * @type {Array<any>}
   */
  args: Array<any> = new Array<any>();

  /**
   * Evaluation Function to evaluate the Collection to Query
   *
   * @abstract
   * @param {Handler} handler
   * @returns {string}
   */
  abstract eval(handler: Handler): string;
}

export default INode;
