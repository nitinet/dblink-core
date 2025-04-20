import ResultSet from '../ResultSet';

describe('ResultSet', () => {
  test('should initialize with empty rows and no error by default', () => {
    const resultSet = new ResultSet();
    expect(resultSet.rows).toEqual([]);
    expect(resultSet.error).toBeNull();
  });

  test('should initialize with provided rows', () => {
    const testRows = [{ id: 1 }, { id: 2 }];
    const resultSet = new ResultSet(testRows);
    expect(resultSet.rows).toEqual(testRows);
    expect(resultSet.error).toBeNull();
  });

  test('should initialize with error message', () => {
    const errorMsg = 'Query failed';
    const resultSet = new ResultSet([], errorMsg);
    expect(resultSet.rows).toEqual([]);
    expect(resultSet.error).toBe(errorMsg);
  });
});
