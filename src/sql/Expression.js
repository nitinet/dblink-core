import Operator from './types/Operator.js';
class Expression {
  args = [];
  value = null;
  operator = null;
  exps = new Array();
  constructor(value, operator, ...expressions) {
    this.value = value ?? null;
    this.operator = operator ?? null;
    this.exps = expressions;
  }
  add(...expressions) {
    if (!this.operator || this.operator == Operator.And) {
      this.exps = this.exps.concat(expressions);
      return this;
    } else {
      const exp = new Expression(null, Operator.And, this);
      expressions.forEach(expr => exp.add(expr));
      return exp;
    }
  }
  and(operand) {
    return new Expression(null, Operator.And, this, operand);
  }
  or(operand) {
    return new Expression(null, Operator.Or, this, operand);
  }
  not() {
    return new Expression(null, Operator.Not, this);
  }
  eval(handler) {
    let query = '';
    let args = [];
    if (this.value) {
      query = this.value;
      args = this.args;
    } else {
      const values = [];
      this.exps.forEach(exp => {
        const { query: expQuery, args: expArgs } = exp.eval(handler);
        values.push(expQuery);
        args.push(...expArgs);
      });
      const val0 = values[0] ? values[0] : '';
      const val1 = values[1] ? values[1] : '';
      if (this.operator || this.exps.length > 1) {
        if (!this.operator) this.operator = Operator.And;
        switch (this.operator) {
          case Operator.Equal:
            query = handler.eq(val0, val1);
            break;
          case Operator.NotEqual:
            query = handler.neq(val0, val1);
            break;
          case Operator.LessThan:
            query = handler.lt(val0, val1);
            break;
          case Operator.LessThanEqual:
            query = handler.lteq(val0, val1);
            break;
          case Operator.GreaterThan:
            query = handler.gt(val0, val1);
            break;
          case Operator.GreaterThanEqual:
            query = handler.gteq(val0, val1);
            break;
          case Operator.And:
            query = handler.and(values);
            break;
          case Operator.Or:
            query = handler.or(values);
            break;
          case Operator.Not:
            query = handler.not(val0);
            break;
          case Operator.Plus:
            query = handler.plus(val0, val1);
            break;
          case Operator.Minus:
            query = handler.minus(val0, val1);
            break;
          case Operator.Multiply:
            query = handler.multiply(val0, val1);
            break;
          case Operator.Devide:
            query = handler.devide(val0, val1);
            break;
          case Operator.Between:
            query = handler.between(values[0], values[1], values[2]);
            break;
          case Operator.Exists:
            query = handler.exists(val0);
            break;
          case Operator.In:
            query = handler.in(values);
            break;
          case Operator.Like:
            query = handler.like(val0, val1);
            break;
          case Operator.IsNull:
            query = handler.isNull(val0);
            break;
          case Operator.IsNotNull:
            query = handler.isNotNull(val0);
            break;
          case Operator.Asc:
            query = handler.asc(val0);
            break;
          case Operator.Desc:
            query = handler.desc(val0);
            break;
          case Operator.Limit:
            query = handler.limit(val0, val1);
            break;
          case Operator.Count:
            query = handler.count(val0);
            break;
          case Operator.Sum:
            query = handler.sum(val0);
            break;
          case Operator.Min:
            query = handler.min(val0);
            break;
          case Operator.Max:
            query = handler.max(val0);
            break;
          case Operator.Avg:
            query = handler.average(val0);
            break;
          default:
            query = handler.and(values);
            break;
        }
      } else {
        query = val0;
      }
    }
    return { query, args };
  }
}
export default Expression;
//# sourceMappingURL=Expression.js.map
