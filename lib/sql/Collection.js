import INode from './INode.js';
import Join from './types/Join.js';
class Collection extends INode {
    colAlias = null;
    value = null;
    stat = null;
    leftColl = null;
    rightColl = null;
    join = null;
    alias = null;
    eval(handler) {
        let res = '';
        if (this.value) {
            res = this.colAlias ? `${this.colAlias}.${this.value}` : this.value;
        }
        else if (this.stat) {
            this.args = this.args.concat(this.stat.args);
            res = `(${this.stat.eval(handler)})`;
        }
        else if (this.leftColl && this.rightColl && this.join) {
            let val0 = this.leftColl.eval(handler);
            let val1 = this.rightColl.eval(handler);
            let join;
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
//# sourceMappingURL=Collection.js.map