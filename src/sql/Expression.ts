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
   * And Opoerator
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

      const val0: string = values[0] ? values[0] : '';
      const val1: string = values[1] ? values[1] : '';

      if (!this.operator) {
        if (this.exps.length == 1) query = val0;
        else this.operator = Operator.And;
      }

      let r: string = '';
      switch (this.operator) {
        case Operator.Equal:
          r = handler.eq(val0, val1);
          break;
        case Operator.NotEqual:
          r = handler.neq(val0, val1);
          break;
        case Operator.LessThan:
          r = handler.lt(val0, val1);
          break;
        case Operator.LessThanEqual:
          r = handler.lteq(val0, val1);
          break;
        case Operator.GreaterThan:
          r = handler.gt(val0, val1);
          break;
        case Operator.GreaterThanEqual:
          r = handler.gteq(val0, val1);
          break;
        case Operator.And:
          r = handler.and(values);
          break;
        case Operator.Or:
          r = handler.or(values);
          break;
        case Operator.Not:
          r = handler.not(val0);
          break;
        case Operator.Plus:
          r = handler.plus(val0, val1);
          break;
        case Operator.Minus:
          r = handler.minus(val0, val1);
          break;
        case Operator.Multiply:
          r = handler.multiply(val0, val1);
          break;
        case Operator.Devide:
          r = handler.devide(val0, val1);
          break;
        case Operator.Between:
          r = handler.between(values[0], values[1], values[2]);
          break;
        case Operator.Exists:
          r = handler.exists(val0);
          break;
        case Operator.In:
          r = handler.in(values);
          break;
        case Operator.Like:
          r = handler.like(val0, val1);
          break;
        case Operator.IsNull:
          r = handler.isNull(val0);
          break;
        case Operator.IsNotNull:
          r = handler.isNotNull(val0);
          break;
        case Operator.Asc:
          r = handler.asc(val0);
          break;
        case Operator.Desc:
          r = handler.desc(val0);
          break;
        case Operator.Limit:
          r = handler.limit(val0, val1);
          break;
        case Operator.Count:
          r = handler.count(val0);
          break;
        case Operator.Sum:
          r = handler.sum(val0);
          break;
        case Operator.Min:
          r = handler.min(val0);
          break;
        case Operator.Max:
          r = handler.max(val0);
          break;
        case Operator.Avg:
          r = handler.average(val0);
          break;
        default:
          break;
      }
      query = r;
    }

    return { query, args };
  }
}

export default Expression;
