import Handler from '../../Handler';
import Expression from '../Expression';
import Operator from '../types/Operator';
import { IConnectionConfig } from '../../model';

class TestHandler extends Handler {
  async init(): Promise<void> {}
  async run(): Promise<{ rows: Record<string, unknown>[]; error: string | null }> {
    return { rows: [], error: null };
  }
  async runStatement(): Promise<{ rows: Record<string, unknown>[]; error: string | null }> {
    return { rows: [], error: null };
  }
  async stream(): Promise<any> {}
  async streamStatement(): Promise<any> {}
  async getConnection(): Promise<any> {}
  async initTransaction(): Promise<void> {}
  async commit(): Promise<void> {}
  async rollback(): Promise<void> {}
  async close(): Promise<void> {}
  getReturnColumnsStr(): string {
    return '';
  }
  serializeValue(val: unknown): unknown {
    return val;
  }
  deSerializeValue(val: unknown): unknown {
    return val;
  }
}

describe('Expression', () => {
  let handler: TestHandler;

  beforeEach(() => {
    const config: IConnectionConfig = {
      host: 'localhost',
      port: 5432,
      username: 'test',
      password: 'test',
      database: 'test_db'
    };
    handler = new TestHandler(config);
  });

  describe('Basic Operations', () => {
    test('should create simple value expression', () => {
      const exp = new Expression('column1');
      expect(exp.eval(handler).query).toBe('column1');
    });

    test('should handle equal operator', () => {
      const exp = new Expression(null, Operator.Equal, new Expression('column1'), new Expression('?'));
      expect(exp.eval(handler).query).toBe('column1 = ?');
    });
  });

  describe('Logical Operations', () => {
    test('should handle AND operator', () => {
      const exp = new Expression(null, Operator.And, new Expression('col1 = ?'), new Expression('col2 = ?'));
      expect(exp.eval(handler).query).toBe('(col1 = ?) and (col2 = ?)');
    });

    test('should handle OR operator', () => {
      const exp = new Expression(null, Operator.Or, new Expression('col1 = ?'), new Expression('col2 = ?'));
      expect(exp.eval(handler).query).toBe('(col1 = ?) or (col2 = ?)');
    });

    test('should handle NOT operator', () => {
      const exp = new Expression(null, Operator.Not, new Expression('col1 = ?'));
      expect(exp.eval(handler).query).toBe(' not col1 = ?');
    });
  });

  describe('add method', () => {
    test('should add multiple expressions with AND by default', () => {
      const exp = new Expression();
      exp.add(new Expression('col1 = ?'), new Expression('col2 = ?'));
      expect(exp.eval(handler).query).toBe('(col1 = ?) and (col2 = ?)');
    });

    test('should create new AND expression when adding to OR expression', () => {
      const exp = new Expression(null, Operator.Or, new Expression('col1 = ?'), new Expression('col2 = ?'));
      const newExp = exp.add(new Expression('col3 = ?'));
      expect(newExp.eval(handler).query).toBe('((col1 = ?) or (col2 = ?)) and (col3 = ?)');
    });
  });
});
