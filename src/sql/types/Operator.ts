/**
 * Sql Operator Types
 *
 * @enum {number}
 */
enum Operator {
  // Comparison Operators
  Equal = 1,
  NotEqual,
  LessThan,
  LessThanEqual,
  GreaterThan,
  GreaterThanEqual,

  // Logical Operators
  And,
  Or,
  Not,

  // Arithmetic Operators
  Plus,
  Minus,
  Multiply,
  Devide,

  // Other SQL Constructs
  Between,
  Exists,
  In,
  Like,
  IsNull,
  IsNotNull,

  // Sorting and Limiting
  Asc,
  Desc,
  Limit,

  // Aggregation Functions
  Count,
  Sum,
  Min,
  Max,
  Avg
}

export default Operator;
