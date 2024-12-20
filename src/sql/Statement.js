import Collection from './Collection.js';
import Expression from './Expression.js';
import INode from './INode.js';
import Command from './types/Command.js';
class Statement extends INode {
  command;
  columns = new Array();
  values = new Array();
  returnColumns = new Array();
  collection = new Collection();
  where = new Expression();
  groupBy = new Array();
  orderBy = new Array();
  limit = new Expression();
  constructor(command) {
    super();
    this.command = command;
  }
  eval(handler) {
    let res;
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
  insertQuery(handler) {
    let query = '';
    const args = [];
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
  selectQuery(handler) {
    let query = '';
    const args = [];
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
  updateQuery(handler) {
    let query = '';
    const args = [];
    const { query: collQuery, args: collArgs } = this.getCollectionStr(handler);
    const { query: colmQuery, args: colmArgs } = this.getColumnStr(handler);
    const { query: whereQuery, args: whereArgs } = this.getWhereStr(handler);
    query = `update ${collQuery} set ${colmQuery}${whereQuery}`;
    args.push(...collArgs);
    args.push(...colmArgs);
    args.push(...whereArgs);
    return { query, args };
  }
  deleteQuery(handler) {
    let query = '';
    const args = [];
    const { query: collQuery, args: collArgs } = this.getCollectionStr(handler);
    const { query: whereQuery, args: whereArgs } = this.getWhereStr(handler);
    query = `delete from ${collQuery}${whereQuery}`;
    args.push(...collArgs);
    args.push(...whereArgs);
    return { query, args };
  }
  getCollectionStr(handler) {
    return this.collection.eval(handler);
  }
  getColumnStr(handler) {
    const data = this.columns.map(ele => ele.eval(handler));
    const query = data.map(a => a.query).join(', ');
    const args = data.map(a => a.args).flat();
    return { query, args };
  }
  getWhereStr(handler) {
    const { query: whereQuery, args } = this.where.eval(handler);
    const query = whereQuery ? ` where ${whereQuery}` : '';
    return { query, args };
  }
  getValueStr(handler) {
    const data = this.values.map(ele => ele.eval(handler));
    const query = data.map(a => a.query).join(', ');
    const args = data.map(a => a.args).flat();
    return { query, args };
  }
  getGroupByStr(handler) {
    const data = this.groupBy.map(ele => ele.eval(handler));
    const groupByStr = data.map(a => a.query).join(', ');
    const query = groupByStr ? ` group by ${groupByStr}` : '';
    const args = data.map(a => a.args).flat();
    return { query, args };
  }
  getOrderByStr(handler) {
    const data = this.orderBy.map(ele => ele.eval(handler));
    const orderByStr = data.map(a => a.query).join(', ');
    const query = orderByStr ? ` order by ${orderByStr}` : '';
    const args = data.map(a => a.args).flat();
    return { query, args };
  }
  getLimitStr(handler) {
    return this.limit.eval(handler);
  }
}
export default Statement;
//# sourceMappingURL=Statement.js.map
