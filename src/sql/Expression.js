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
        }
        else {
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
        }
        else {
            const values = [];
            this.exps.forEach(exp => {
                const { query: expQuery, args: expArgs } = exp.eval(handler);
                values.push(expQuery);
                args.push(...expArgs);
            });
            const [val0 = '', val1 = ''] = values;
            if (this.operator || this.exps.length > 1) {
                if (!this.operator)
                    this.operator = Operator.And;
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
            }
            else {
                query = val0;
            }
        }
        return { query, args };
    }
}
export default Expression;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXhwcmVzc2lvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkV4cHJlc3Npb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxRQUFRLE1BQU0scUJBQXFCLENBQUM7QUFLM0MsTUFBTSxVQUFVO0lBTWQsSUFBSSxHQUFjLEVBQUUsQ0FBQztJQU9yQixLQUFLLEdBQWtCLElBQUksQ0FBQztJQU81QixRQUFRLEdBQW9CLElBQUksQ0FBQztJQU9qQyxJQUFJLEdBQXNCLElBQUksS0FBSyxFQUFjLENBQUM7SUFVbEQsWUFBWSxLQUFxQixFQUFFLFFBQW1CLEVBQUUsR0FBRyxXQUE4QjtRQUN2RixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssSUFBSSxJQUFJLENBQUM7UUFDM0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLElBQUksSUFBSSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxJQUFJLEdBQUcsV0FBVyxDQUFDO0lBQzFCLENBQUM7SUFRRCxHQUFHLENBQUMsR0FBRyxXQUE4QjtRQUNuQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUNwRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQzFDLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQzthQUFNLENBQUM7WUFDTixNQUFNLEdBQUcsR0FBZSxJQUFJLFVBQVUsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNqRSxXQUFXLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzNDLE9BQU8sR0FBRyxDQUFDO1FBQ2IsQ0FBQztJQUNILENBQUM7SUFTRCxHQUFHLENBQUMsT0FBbUI7UUFD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