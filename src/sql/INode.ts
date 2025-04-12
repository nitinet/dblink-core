import Handler from '../Handler.js';

/**
 * Abstract base class representing a minimal SQL AST node.
 * Each subclass must implement `eval()` to produce SQL and its parameters.
 *
 * @abstract
 * @implements {INode}
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
