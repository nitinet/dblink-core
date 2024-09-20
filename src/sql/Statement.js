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
        let result;
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
    insertQuery(handler) {
        const collectionStr = this.getCollectionStr(handler);
        const columnStr = this.getColumnStr(handler);
        const valueStr = this.getValueStr(handler);
        const returnColumnsStr = handler.getReturnColumnsStr(this.returnColumns);
        return `insert into ${collectionStr} (${columnStr}) values (${valueStr}) ${returnColumnsStr}`;
    }
    selectQuery(handler) {
        const collectionStr = this.getCollectionStr(handler);
        const columnStr = this.getColumnStr(handler);
        const whereStr = this.getWhereStr(handler);
        const groupByStr = this.getGroupByStr(handler);
        const orderByStr = this.getOrderByStr(handler);
        const limitStr = this.getLimitStr(handler);
        return `select ${columnStr} from ${collectionStr}${whereStr}${groupByStr}${orderByStr}${limitStr}`;
    }
    updateQuery(handler) {
        const collectionStr = this.getCollectionStr(handler);
        const columnStr = this.getColumnStr(handler);
        const whereStr = this.getWhereStr(handler);
        return `update ${collectionStr} set ${columnStr}${whereStr}`;
    }
    deleteQuery(handler) {
        const collectionStr = this.getCollectionStr(handler);
        const whereStr = this.getWhereStr(handler);
        return `delete from ${collectionStr}${whereStr}`;
    }
    getCollectionStr(handler) {
        const collectionStr = this.collection.eval(handler);
        this.args = this.args.concat(this.collection.args);
        return collectionStr;
    }
    getColumnStr(handler) {
        return this.columns
            .map(ele => {
            const r = ele.eval(handler);
            this.args = this.args.concat(ele.args);
            return r;
        }, this)
            .join(', ');
    }
    getWhereStr(handler) {
        const whereStr = this.where.eval(handler);
        this.args = this.args.concat(this.where.args);
        return whereStr ? ` where ${whereStr}` : '';
    }
    getValueStr(handler) {
        return this.values
            .map(ele => {
            const r = ele.eval(handler);
            this.args = this.args.concat(ele.args);
            return r;
        }, this)
            .join(', ');
    }
    getGroupByStr(handler) {
        const groupByStr = this.groupBy
            .map(ele => {
            const r = ele.eval(handler);
            this.args = this.args.concat(ele.args);
            return r;
        }, this)
            .join(', ');
        return groupByStr ? ` group by ${groupByStr}` : '';
    }
    getOrderByStr(handler) {
        const orderByStr = this.orderBy
            .map(ele => {
            const r = ele.eval(handler);
            this.args = this.args.concat(ele.args);
            return r;
        }, this)
            .join(', ');
        return orderByStr ? ` order by ${orderByStr}` : '';
    }
    getLimitStr(handler) {
        const limitStr = this.limit.eval(handler);
        this.args = this.args.concat(this.limit.args);
        return limitStr;
    }
}
export default Statement;
//# sourceMappingURL=Statement.js.map