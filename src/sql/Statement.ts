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
  eval(handler: Handler): string {
    let result: string;
    switch (this.command) {
      case Command.SELECT:
        result = this.selectQuery(handler);
        break;
      case Command.INSERT:
        result = this.insertQuery(handler);
        break;
      case Command.UPDATE:
        result = this.updateQuery(handler);
        break;
      case Command.DELETE:
        result = this.deleteQuery(handler);
        break;
      default:
        throw new Error('Invalid Statement');
    }
    return result;
  }

  /**
   * Generate Insert query
   *
   * @param {Handler} handler
   * @returns {string}
   */
  insertQuery(handler: Handler): string {
    const collectionStr = this.getCollectionStr(handler);
    const columnStr = this.getColumnStr(handler);
    const valueStr = this.getValueStr(handler);

    const returnColumnsStr = this.returnColumns.length ? handler.getReturnColumnsStr(this.returnColumns) : '';

    return `insert into ${collectionStr} (${columnStr}) values (${valueStr}) ${returnColumnsStr}`;
  }

  /**
   * generate Select query
   *
   * @param {Handler} handler
   * @returns {string}
   */
  selectQuery(handler: Handler): string {
    const collectionStr = this.getCollectionStr(handler);
    const columnStr = this.getColumnStr(handler);
    const whereStr = this.getWhereStr(handler);
    const groupByStr = this.getGroupByStr(handler);
    const orderByStr = this.getOrderByStr(handler);
    const limitStr = this.getLimitStr(handler);

    return `select ${columnStr} from ${collectionStr}${whereStr}${groupByStr}${orderByStr}${limitStr}`;
  }

  /**
   * Generate Update query
   *
   * @param {Handler} handler
   * @returns {string}
   */
  updateQuery(handler: Handler): string {
    const collectionStr = this.getCollectionStr(handler);
    const columnStr = this.getColumnStr(handler);
    const whereStr = this.getWhereStr(handler);

    return `update ${collectionStr} set ${columnStr}${whereStr}`;
  }

  /**
   * Generate Delete query
   *
   * @param {Handler} handler
   * @returns {string}
   */
  deleteQuery(handler: Handler): string {
    const collectionStr = this.getCollectionStr(handler);
    const whereStr = this.getWhereStr(handler);

    return `delete from ${collectionStr}${whereStr}`;
  }

  /**
   * Get collection query
   *
   * @param {Handler} handler
   * @returns {string}
   */
  getCollectionStr(handler: Handler): string {
    const collectionStr: string = this.collection.eval(handler);
    this.args = this.args.concat(this.collection.args);
    return collectionStr;
  }

  /**
   * Get Collumns query
   *
   * @param {Handler} handler
   * @returns {*}
   */
  getColumnStr(handler: Handler): string {
    return this.columns
      .map(ele => {
        const r = ele.eval(handler);
        this.args = this.args.concat(ele.args);
        return r;
      }, this)
      .join(', ');
  }

  /**
   * Get Where query
   *
   * @param {Handler} handler
   * @returns {string}
   */
  getWhereStr(handler: Handler): string {
    const whereStr: string = this.where.eval(handler);
    this.args = this.args.concat(this.where.args);
    return whereStr ? ` where ${whereStr}` : '';
  }

  /**
   * Get values query
   *
   * @param {Handler} handler
   * @returns {*}
   */
  getValueStr(handler: Handler): string {
    return this.values
      .map(ele => {
        const r = ele.eval(handler);
        this.args = this.args.concat(ele.args);
        return r;
      }, this)
      .join(', ');
  }

  /**
   * Get Group By query
   *
   * @param {Handler} handler
   * @returns {string}
   */
  getGroupByStr(handler: Handler): string {
    const groupByStr = this.groupBy
      .map(ele => {
        const r = ele.eval(handler);
        this.args = this.args.concat(ele.args);
        return r;
      }, this)
      .join(', ');
    return groupByStr ? ` group by ${groupByStr}` : '';
  }

  /**
   * Get Order By query
   *
   * @param {Handler} handler
   * @returns {string}
   */
  getOrderByStr(handler: Handler): string {
    const orderByStr = this.orderBy
      .map(ele => {
        const r = ele.eval(handler);
        this.args = this.args.concat(ele.args);
        return r;
      }, this)
      .join(', ');
    return orderByStr ? ` order by ${orderByStr}` : '';
  }

  /**
   * Get Limit query
   *
   * @param {Handler} handler
   * @returns {string}
   */
  getLimitStr(handler: Handler): string {
    const limitStr: string = this.limit.eval(handler);
    this.args = this.args.concat(this.limit.args);
    return limitStr;
  }
}

export default Statement;
