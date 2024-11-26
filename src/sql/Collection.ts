import Handler from '../Handler.js';
import INode from './INode.js';
import Statement from './Statement.js';
import Join from './types/Join.js';

/**
 * SqlCollection
 * Used for tables and columns
 */
class Collection extends INode {
  /**
   * Column Alias
   *
   * @type {(string | null)}
   */
  colAlias: string | null = null;

  /**
   * Column Value
   *
   * @type {(string | null)}
   */
  value: string | null = null;

  /**
   * Statement Object
   *
   * @type {(Statement | null)}
   */
  stat: Statement | null = null;

  /**
   * Join Left Collection
   *
   * @type {(Collection | null)}
   */
  leftColl: Collection | null = null;

  /**
   * Join Right Collection
   *
   * @type {(Collection | null)}
   */
  rightColl: Collection | null = null;

  /**
   * Join Type
   *
   * @type {(Join | null)}
   */
  join: Join | null = null;

  /**
   * Alias
   *
   * @type {(string | null)}
   */
  alias: string | null = null;

  /**
   * Evaluation Function to evaluate the Collection to Query
   *
   * @param {Handler} handler
   * @returns {string}
   */
  eval(handler: Handler): { query: string; args: unknown[] } {
    let query: string = '';
    let args: unknown[] = [];

    if (this.value) {
      query = this.colAlias ? `${this.colAlias}.${this.value}` : this.value;
    } else if (this.stat) {
      const { query: stmtQuery, args: stmtArgs } = this.stat.eval(handler);

      query = stmtQuery;
      args = stmtArgs;
    } else if (this.leftColl && this.rightColl && this.join) {
      const { query: leftQuery, args: leftArgs } = this.leftColl.eval(handler);
      const { query: rightQuery, args: rightArgs } = this.rightColl.eval(handler);
      let join: string;

      switch (this.join) {
        case Join.InnerJoin:
          join = 'inner';
          break;
        case Join.LeftJoin:
          join = 'left';
          break;
        case Join.RightJoin:
          join = 'right';
          break;
        case Join.OuterJoin:
          join = 'outer';
          break;
        default:
          join = 'inner';
          break;
      }

      query = `(${leftQuery} ${join} join ${rightQuery})`;
      args.push(...leftArgs);
      args.push(...rightArgs);
    }
    if (!query) {
      throw new Error('No Collection Found');
    }
    if (this.alias) {
      query = `${query} as ${this.alias}`;
    }

    return { query, args };
  }
}

export default Collection;
