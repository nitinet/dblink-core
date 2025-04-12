import Handler from '../Handler.js';
import INode from './INode.js';
import Operator from './types/Operator.js';

/**
 * SqlExpression
 */
class Expression implements INode {
  /**
   * Arguments of Expression
   *
   * @type {Array<any>}
   */
  args: unknown[] = [];

  /**
   * Value of Expression
   *
   * @type {(string | null)}
   */
  value: string | null = null;

  /**
   * Expression Operator
   *
   * @type {(Operator | null)}
   */
  operator: Operator | null = null;

  /**
   * Sub expression inside the expression
   *
   * @type {Array<Expression>}
   */
  exps: Array<Expression> = new Array<Expression>();

  /**
   * Creates an instance of Expression.
   *
   * @constructor
   * @param {?(string | null)} [value]
   * @param {?Operator} [operator]
   * @param {...Array<Expression>} expressions
   */
  constructor(value?: string | null, operator?: Operator, ...expressions: Array<Expression>) {
    this.value = value ?? null;
    this.operator = operator ?? null;
    this.exps = expressions;
  }

  /**
   * Add function to add sub expression
   *
   * @param {...Array<Expression>} expressions
   * @returns {Expression}
   */
  add(...expressions: Array<Expression>): Expression {
    if (!this.operator || this.operator == Operator.And) {
      this.exps = this.exps.concat(expressions);
      return this;
    } else {
      const exp: Expression = new Expression(null, Operator.And, this);
      expressions.forEach(expr => exp.add(expr));
      return exp;
    }
  }

  // Logical Operators
  /**
   * And Operator
   *
   * @param {Expression} operand
   * @returns {Expression}
   */
  and(operand: Expression): Expression {
    return new Expression(null, Operator.And, this, operand);
  }

  /**
   * Or Operator
   *
   * @param {Expression} operand
   * @returns {Expression}
   */
  or(operand: Expression): Expression {
    return new Expression(null, Operator.Or, this, operand);
  }

  /**
   * Not Operator
   *
   * @returns {Expression}
   */
  not(): Expression {
    return new Expression(null, Operator.Not, this);
  }

  /**
   * Evaluation Function to evaluate the Collection to Query
   *
   * @param {Handler} handler
   * @returns {string}
   */
  eval(handler: Handler): { query: string; args: unknown[] } {
    let query: string = '';
    let args: unknown[] = [];

    if (this.value) {
      query = this.value;
      args = this.args;
    } else {
      const values: string[] = [];

      this.exps.forEach(exp => {
        const { query: expQuery, args: expArgs } = exp.eval(handler);
        values.push(expQuery);
        args.push(...expArgs);
      });

      const [val0 = '', val1 = ''] = values;

      if (this.operator || this.exps.length > 1) {
        if (!this.operator) this.operator = Operator.And;

        switch (this.operator) {
          // Comparison
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
          // Logical
          case Operator.And:
            query = handler.and(values);
            break;
          case Operator.Or:
            query = handler.or(values);
            break;
          case Operator.Not:
            query = handler.not(val0);
            break;
          // Arithmetic
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
          // Aggregate
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
          // Default
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
