import Handler from '../../Handler';
import Collection from '../Collection';
import Statement from '../Statement';
import Command from '../types/Command';
import Join from '../types/Join';
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

describe('Collection', () => {
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

  describe('Basic Collection', () => {
    test('should handle simple table name', () => {
      const collection = new Collection();
      collection.value = 'users';
      expect(collection.eval(handler).query).toBe('users');
    });

    test('should handle table with alias', () => {
      const collection = new Collection();
      collection.value = 'users';
      collection.alias = 'u';
      expect(collection.eval(handler).query).toBe('users as u');
    });

    test('should handle column with table alias', () => {
      const collection = new Collection();
      collection.colAlias = 'u';
      collection.value = 'name';
      expect(collection.eval(handler).query).toBe('u.name');
    });
  });

  describe('Joins', () => {
    test('should generate INNER JOIN', () => {
      const users = new Collection();
      users.value = 'users';
      users.alias = 'u';

      const posts = new Collection();
      posts.value = 'posts';
      posts.alias = 'p';

      const joined = new Collection();
      joined.leftColl = users;
      joined.rightColl = posts;
      joined.join = Join.InnerJoin;

      expect(joined.eval(handler).query).toBe('(users as u inner join posts as p)');
    });

    test('should generate LEFT JOIN', () => {
      const users = new Collection();
      users.value = 'users';
      users.alias = 'u';

      const posts = new Collection();
      posts.value = 'posts';
      posts.alias = 'p';

      const joined = new Collection();
      joined.leftColl = users;
      joined.rightColl = posts;
      joined.join = Join.LeftJoin;

      expect(joined.eval(handler).query).toBe('(users as u left join posts as p)');
    });
  });

  describe('Subqueries', () => {
    test('should handle subquery as collection', () => {
      const subquery = new Statement(Command.SELECT);
      subquery.collection.value = 'users';
      const countCol = new Collection();
      countCol.value = 'COUNT(*)';
      subquery.columns.push(countCol);

      const collection = new Collection();
      collection.stat = subquery;
      collection.alias = 'sub';

      expect(collection.eval(handler).query).toBe('(select COUNT(*) from users) as sub');
    });
  });

  test('should throw error when no collection is specified', () => {
    const collection = new Collection();
    expect(() => collection.eval(handler)).toThrow('No Collection Found');
  });
});
