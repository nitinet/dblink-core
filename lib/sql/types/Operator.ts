/**
 * Sql Operator Types
 *
 * @enum {number}
 */
enum Operator {
  Equal = 1,
  NotEqual,
  LessThan,
  LessThanEqual,
  GreaterThan,
  GreaterThanEqual,
  And,
  Or,
  Not,
  Plus,
  Minus,
  Multiply,
  Devide,
  Between,
  Exists,
  In,
  Like,
  IsNull,
  IsNotNull,
  Asc,
  Desc,
  Limit,
  Count,
  Sum,
  Min,
  Max,
  Avg
}

export default Operator;
