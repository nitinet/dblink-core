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
   * Private helper method to resolve the SQL join type
   *
   * @param {Join} join
   * @returns {string}
   */
  private resolveJoinType(join: Join): string {
    switch (join) {
      case Join.LeftJoin:
        return 'left';
      case Join.RightJoin:
        return 'right';
      case Join.OuterJoin:
        return 'outer';
      default:
        return 'inner';
    }
  }

  /**
   * Evaluation Function to evaluate the Collection to Query
   *
   * @param {Handler} handler
   * @returns {{ query: string; args: unknown[] }}
   */
  eval(handler: Handler): { query: string; args: unknown[] } {
    let query: string = '';
    let args: unknown[] = [];

    // Evaluate based on value
    if (this.value) {
      query = this.colAlias ? `${this.colAlias}.${this.value}` : this.value;
    }
    // Evaluate based on statement
    else if (this.stat) {
      const { query: stmtQuery, args: stmtArgs } = this.stat.eval(handler);
      query = `(${stmtQuery})`;
      args = stmtArgs;
    }
    // Evaluate based on join
    else if (this.leftColl && this.rightColl && this.join) {
      const { query: leftQuery, args: leftArgs } = this.leftColl.eval(handler);
      const { query: rightQuery, args: rightArgs } = this.rightColl.eval(handler);
      const joinType = this.resolveJoinType(this.join);
      query = `(${leftQuery} ${joinType} join ${rightQuery})`;
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
