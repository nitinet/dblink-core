import Handler from '../../Handler';
import Statement from '../Statement';
import Expression from '../Expression';
import Collection from '../Collection';
import Command from '../types/Command';
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
    return 'returning *';
  }
  serializeValue(val: unknown): unknown {
    return val;
  }
  deSerializeValue(val: unknown): unknown {
    return val;
  }
}

describe('Statement', () => {
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

  describe('SELECT Statement', () => {
    test('should generate basic SELECT query', () => {
      const stmt = new Statement(Command.SELECT);
      const col = new Collection();
      col.value = 'users';
      stmt.collection = col;

      const colExpr = new Expression('*');
      stmt.columns.push(colExpr);

      const { query } = stmt.eval(handler);
      expect(query).toBe('select * from users');
    });

    test('should generate SELECT with WHERE clause', () => {
      const stmt = new Statement(Command.SELECT);
      const col = new Collection();
      col.value = 'users';
      stmt.collection = col;

      stmt.columns.push(new Expression('*'));
      stmt.where = new Expression('id = ?');

      const { query } = stmt.eval(handler);
      expect(query).toBe('select * from users where id = ?');
    });

    test('should generate SELECT with ORDER BY', () => {
      const stmt = new Statement(Command.SELECT);
      const col = new Collection();
      col.value = 'users';
      stmt.collection = col;

      stmt.columns.push(new Expression('*'));
      stmt.orderBy.push(new Expression('name asc'));

      const { query } = stmt.eval(handler);
      expect(query).toBe('select * from users order by name asc');
    });
  });

  describe('INSERT Statement', () => {
    test('should generate basic INSERT query', () => {
      const stmt = new Statement(Command.INSERT);
      const col = new Collection();
      col.value = 'users';
      stmt.collection = col;

      stmt.columns.push(new Expression('name'));
      stmt.values.push(new Expression('?'));

      const { query } = stmt.eval(handler);
      expect(query).toBe('insert into users (name) values (?)');
    });

    test('should generate INSERT with RETURNING clause', () => {
      const stmt = new Statement(Command.INSERT);
      const col = new Collection();
      col.value = 'users';
      stmt.collection = col;

      stmt.columns.push(new Expression('name'));
      stmt.values.push(new Expression('?'));
      stmt.returnColumns.push(new Expression('*'));

      const { query } = stmt.eval(handler);
      expect(query).toBe('insert into users (name) values (?) returning *');
    });
  });

  describe('UPDATE Statement', () => {
    test('should generate basic UPDATE query', () => {
      const stmt = new Statement(Command.UPDATE);
      const col = new Collection();
      col.value = 'users';
      stmt.collection = col;

      stmt.columns.push(new Expression('name = ?'));
      stmt.where = new Expression('id = ?');

      const { query } = stmt.eval(handler);
      expect(query).toBe('update users set name = ? where id = ?');
    });
  });

  describe('DELETE Statement', () => {
    test('should generate basic DELETE query', () => {
      const stmt = new Statement(Command.DELETE);
      const col = new Collection();
      col.value = 'users';
      stmt.collection = col;

      stmt.where = new Expression('id = ?');

      const { query } = stmt.eval(handler);
      expect(query).toBe('delete from users where id = ?');
    });
  });
});
