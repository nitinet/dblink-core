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
  eval(handler: Handler): string {
    let res: string = '';
    if (this.value) {
      res = this.colAlias ? `${this.colAlias}.${this.value}` : this.value;
    } else if (this.stat) {
      this.args = this.args.concat(this.stat.args);
      res = `(${this.stat.eval(handler)})`;
    } else if (this.leftColl && this.rightColl && this.join) {
      const val0: string = this.leftColl.eval(handler);
      const val1: string = this.rightColl.eval(handler);
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

      res = `(${val0} ${join} join ${val1})`;
    }
    if (!res) {
      throw new Error('No Collection Found');
    }
    if (this.alias) {
      res = `${res} as ${this.alias}`;
    }
    return res;
  }
}

export default Collection;
