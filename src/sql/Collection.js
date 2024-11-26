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
    let query = '';
    let args = [];
    if (this.value) {
      query = this.colAlias ? `${this.colAlias}.${this.value}` : this.value;
    } else if (this.stat) {
      const { query: stmtQuery, args: stmtArgs } = this.stat.eval(handler);
      query = stmtQuery;
      args = stmtArgs;
    } else if (this.leftColl && this.rightColl && this.join) {
      const { query: leftQuery, args: leftArgs } = this.leftColl.eval(handler);
      const { query: rightQuery, args: rightArgs } = this.rightColl.eval(handler);
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
//# sourceMappingURL=Collection.js.map
