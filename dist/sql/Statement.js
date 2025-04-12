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
    combineQueries(parts, ...argSets) {
        return {
            query: parts.filter(Boolean).join(' '),
            args: argSets.flat()
        };
    }
    insertQuery(handler) {
        const { query: collQuery, args: collArgs } = this.getCollectionStr(handler);
        const { query: colmQuery, args: colmArgs } = this.getColumnStr(handler);
        const { query: valQuery, args: valArgs } = this.getValueStr(handler);
        const returnColumnsStr = this.returnColumns.length ? handler.getReturnColumnsStr(this.returnColumns) : '';
        const parts = ['insert into', collQuery, `(${colmQuery})`, 'values', `(${valQuery})`, returnColumnsStr];
        return this.combineQueries(parts, collArgs, colmArgs, valArgs);
    }
    selectQuery(handler) {
        const parts = [];
        const { query: colmQuery, args: colmArgs } = this.getColumnStr(handler);
        const { query: collQuery, args: collArgs } = this.getCollectionStr(handler);
        const { query: whereQuery, args: whereArgs } = this.getWhereStr(handler);
        const { query: groupQuery, args: groupArgs } = this.getGroupByStr(handler);
        const { query: orderQuery, args: orderArgs } = this.getOrderByStr(handler);
        const { query: limitQuery, args: limitArgs } = this.getLimitStr(handler);
        parts.push('select', colmQuery, 'from', collQuery, whereQuery, groupQuery, orderQuery, limitQuery);
        return this.combineQueries(parts, collArgs, colmArgs, whereArgs, groupArgs, orderArgs, limitArgs);
    }
    updateQuery(handler) {
        const parts = [];
        const { query: collQuery, args: collArgs } = this.getCollectionStr(handler);
        const { query: colmQuery, args: colmArgs } = this.getColumnStr(handler);
        const { query: whereQuery, args: whereArgs } = this.getWhereStr(handler);
        parts.push('update', collQuery, 'set', colmQuery, whereQuery);
        return this.combineQueries(parts, collArgs, colmArgs, whereArgs);
    }
    deleteQuery(handler) {
        const parts = [];
        const { query: collQuery, args: collArgs } = this.getCollectionStr(handler);
        const { query: whereQuery, args: whereArgs } = this.getWhereStr(handler);
        parts.push('delete from', collQuery, whereQuery);
        return this.combineQueries(parts, collArgs, whereArgs);
    }
    getCollectionStr(handler) {
        return this.collection.eval(handler);
    }
    getColumnStr(handler) {
        const data = this.columns.map(ele => ele.eval(handler));
        return {
            query: data.map(a => a.query).join(', '),
            args: data.flatMap(a => a.args)
        };
    }
    getWhereStr(handler) {
        const { query: whereQuery, args } = this.where.eval(handler);
        const query = whereQuery ? `where ${whereQuery}` : '';
        return { query, args };
    }
    getValueStr(handler) {
        const data = this.values.map(ele => ele.eval(handler));
        return {
            query: data.map(a => a.query).join(', '),
            args: data.flatMap(a => a.args)
        };
    }
    getGroupByStr(handler) {
        const data = this.groupBy.map(ele => ele.eval(handler));
        const groupByStr = data.map(a => a.query).join(', ');
        return {
            query: groupByStr ? `group by ${groupByStr}` : '',
            args: data.flatMap(a => a.args)
        };
    }
    getOrderByStr(handler) {
        const data = this.orderBy.map(ele => ele.eval(handler));
        const orderByStr = data.map(a => a.query).join(', ');
        return {
            query: orderByStr ? `order by ${orderByStr}` : '',
            args: data.flatMap(a => a.args)
        };
    }
    getLimitStr(handler) {
        return this.limit.eval(handler);
    }
}
export default Statement;
//# sourceMappingURL=Statement.js.map