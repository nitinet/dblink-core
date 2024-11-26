import Handler from '../Handler.js';
import Collection from './Collection.js';
import Expression from './Expression.js';
import INode from './INode.js';
import Command from './types/Command.js';

/**
 * SqlStatement
 */
class Statement extends INode {
  /**
   * Command Type
   *
   * @type {Command}
   */
  command: Command;

  /**
   * Column Nodes for select, insert, update
   *
   * @type {Array<INode>}
   */
  columns: Array<INode> = new Array<INode>();

  /**
   * Values for insert
   *
   * @type {Array<Expression>}
   */
  values: Array<Expression> = new Array<Expression>();

  /**
   * Returning Column Nodes for insert
   *
   * @type {Array<INode>}
   */
  returnColumns: Array<INode> = new Array<INode>();

  /**
   * Collection
   *
   * @type {Collection}
   */
  collection: Collection = new Collection();

  /**
   * Where expression
   *
   * @type {Expression}
   */
  where: Expression = new Expression();

  /**
   * Group By Expression
   *
   * @type {Array<Expression>}
   */
  groupBy: Array<Expression> = new Array<Expression>();

  /**
   * Order By Expression
   *
   * @type {Array<Expression>}
   */
  orderBy: Array<Expression> = new Array<Expression>();

  /**
   * Limit Expression
   *
   * @type {Expression}
   */
  limit: Expression = new Expression();

  /**
   * Creates an instance of Statement.
   *
   * @constructor
   * @param {Command} command
   */
  constructor(command: Command) {
    super();
    this.command = command;
  }

  /**
   * Evaluation Function to evaluate the Collection to Query
   *
   * @param {Handler} handler
   * @returns {string}
   */
  eval(handler: Handler): { query: string; args: unknown[] } {
    let res: { query: string; args: unknown[] };

    switch (this.command) {
      case Command.SELECT:
        res = this.selectQuery(handler);
        break;
      case Command.INSERT:
        res = this.insertQuery(handler);
        break;
      case Command.UPDATE:
        res = this.updateQuery(handler);
        break;
      case Command.DELETE:
        res = this.deleteQuery(handler);
        break;
      default:
        throw new Error('Invalid Statement');
    }

    return res;
  }

  /**
   * Generate Insert query
   *
   * @param {Handler} handler
   * @returns {string}
   */
  insertQuery(handler: Handler): { query: string; args: unknown[] } {
    let query: string = '';
    const args: unknown[] = [];

    const { query: collQuery, args: collArgs } = this.getCollectionStr(handler);
    const { query: colmQuery, args: colmArgs } = this.getColumnStr(handler);
    const { query: valQuery, args: valArgs } = this.getValueStr(handler);

    const returnColumnsStr = this.returnColumns.length ? handler.getReturnColumnsStr(this.returnColumns) : '';

    query = `insert into ${collQuery} (${colmQuery}) values (${valQuery}) ${returnColumnsStr}`;

    args.push(...collArgs);
    args.push(...colmArgs);
    args.push(...valArgs);

    return { query, args };
  }

  /**
   * generate Select query
   *
   * @param {Handler} handler
   * @returns {string}
   */
  selectQuery(handler: Handler): { query: string; args: unknown[] } {
    let query: string = '';
    const args: unknown[] = [];

    const { query: colmQuery, args: colmArgs } = this.getColumnStr(handler);
    const { query: collQuery, args: collArgs } = this.getCollectionStr(handler);
    const { query: whereQuery, args: whereArgs } = this.getWhereStr(handler);
    const { query: groupQuery, args: groupArgs } = this.getGroupByStr(handler);
    const { query: orderQuery, args: orderArgs } = this.getOrderByStr(handler);
    const { query: limitQuery, args: limitArgs } = this.getLimitStr(handler);

    query = `select ${colmQuery} from ${collQuery}${whereQuery}${groupQuery}${orderQuery}${limitQuery}`;

    args.push(...colmArgs);
    args.push(...collArgs);
    args.push(...whereArgs);
    args.push(...groupArgs);
    args.push(...orderArgs);
    args.push(...limitArgs);

    return { query, args };
  }

  /**
   * Generate Update query
   *
   * @param {Handler} handler
   * @returns {string}
   */
  updateQuery(handler: Handler): { query: string; args: unknown[] } {
    let query: string = '';
    const args: unknown[] = [];

    const { query: collQuery, args: collArgs } = this.getCollectionStr(handler);
    const { query: colmQuery, args: colmArgs } = this.getColumnStr(handler);
    const { query: whereQuery, args: whereArgs } = this.getWhereStr(handler);

    query = `update ${collQuery} set ${colmQuery}${whereQuery}`;

    args.push(...collArgs);
    args.push(...colmArgs);
    args.push(...whereArgs);

    return { query, args };
  }

  /**
   * Generate Delete query
   *
   * @param {Handler} handler
   * @returns {string}
   */
  deleteQuery(handler: Handler): { query: string; args: unknown[] } {
    let query: string = '';
    const args: unknown[] = [];

    const { query: collQuery, args: collArgs } = this.getCollectionStr(handler);
    const { query: whereQuery, args: whereArgs } = this.getWhereStr(handler);

    query = `delete from ${collQuery}${whereQuery}`;

    args.push(...collArgs);
    args.push(...whereArgs);

    return { query, args };
  }

  /**
   * Get collection query
   *
   * @param {Handler} handler
   * @returns {string}
   */
  getCollectionStr(handler: Handler) {
    return this.collection.eval(handler);
  }

  /**
   * Get Collumns query
   *
   * @param {Handler} handler
   * @returns {*}
   */
  getColumnStr(handler: Handler): { query: string; args: unknown[] } {
    const data = this.columns.map(ele => ele.eval(handler));
    const query = data.map(a => a.query).join(', ');
    const args = data.map(a => a.args).flat();
    return { query, args };
  }

  /**
   * Get Where query
   *
   * @param {Handler} handler
   * @returns {string}
   */
  getWhereStr(handler: Handler): { query: string; args: unknown[] } {
    const { query: whereQuery, args } = this.where.eval(handler);
    const query = whereQuery ? ` where ${whereQuery}` : '';
    return { query, args };
  }

  /**
   * Get values query
   *
   * @param {Handler} handler
   * @returns {*}
   */
  getValueStr(handler: Handler): { query: string; args: unknown[] } {
    const data = this.values.map(ele => ele.eval(handler));
    const query = data.map(a => a.query).join(', ');
    const args = data.map(a => a.args).flat();
    return { query, args };
  }

  /**
   * Get Group By query
   *
   * @param {Handler} handler
   * @returns {string}
   */
  getGroupByStr(handler: Handler): { query: string; args: unknown[] } {
    const data = this.groupBy.map(ele => ele.eval(handler));
    const groupByStr = data.map(a => a.query).join(', ');
    const query = groupByStr ? ` group by ${groupByStr}` : '';
    const args = data.map(a => a.args).flat();
    return { query, args };
  }

  /**
   * Get Order By query
   *
   * @param {Handler} handler
   * @returns {string}
   */
  getOrderByStr(handler: Handler): { query: string; args: unknown[] } {
    const data = this.orderBy.map(ele => ele.eval(handler));
    const orderByStr = data.map(a => a.query).join(', ');
    const query = orderByStr ? ` order by ${orderByStr}` : '';
    const args = data.map(a => a.args).flat();
    return { query, args };
  }

  /**
   * Get Limit query
   *
   * @param {Handler} handler
   * @returns {string}
   */
  getLimitStr(handler: Handler): { query: string; args: unknown[] } {
    return this.limit.eval(handler);
  }
}

export default Statement;
