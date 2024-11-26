import { Readable } from 'node:stream';
import * as model from './model/index.js';
import * as sql from './sql/index.js';
import { DataType, IEntityType } from './types.js';

/**
 * Abstract handler class for implementing all Handlers
 *
 * @export
 * @abstract
 * @class Handler
 * @typedef {Handler}
 */
export default abstract class Handler {
  /**
   * Handler Connections Configuration
   *
   * @type {model.IConnectionConfig}
   */
  config: model.IConnectionConfig;

  /**
   * Creates an instance of Handler.
   *
   * @constructor
   * @param {model.IConnectionConfig} config
   */
  constructor(config: model.IConnectionConfig) {
    this.config = config;
  }

  /**
   * Handler initialisation
   *
   * @abstract
   * @returns {Promise<void>}
   */
  abstract init(): Promise<void>;

  /**
   * Query prepration from statement or statements
   *
   * @param {(sql.Statement | sql.Statement[])} queryStmt
   * @returns {{ query: string; dataArgs: {}; }}
   */
  protected prepareQuery(queryStmt: sql.Statement | sql.Statement[]): {
    query: string;
    dataArgs: unknown[];
  } {
    let query: string;
    const dataArgs: unknown[] = [];

    if (Array.isArray(queryStmt)) {
      const tempQueries: string[] = [];
      queryStmt.forEach(a => {
        if (!(a instanceof sql.Statement)) throw new Error('Invalid Statement');

        const { query, args } = a.eval(this);
        tempQueries.push(query);
        dataArgs.push(...args);
      });
      query = tempQueries.join('; ').concat(';');
    } else if (queryStmt instanceof sql.Statement) {
      const { query: stmtQuery, args } = queryStmt.eval(this);
      query = stmtQuery;
      dataArgs.push(...args);
    } else {
      throw new Error('Invaid Statement');
    }
    return { query, dataArgs };
  }

  /**
   * Run string query
   *
   * @abstract
   * @param {string} query
   * @param {?any[]} [dataArgs]
   * @param {?*} [connection]
   * @returns {Promise<model.ResultSet>}
   */
  abstract run(query: string, dataArgs?: unknown[], connection?: unknown): Promise<model.ResultSet>;

  /**
   * Run statements
   *
   * @abstract
   * @param {(sql.Statement | sql.Statement[])} query
   * @param {?*} [connection]
   * @returns {Promise<model.ResultSet>}
   */
  abstract runStatement(query: sql.Statement | sql.Statement[], connection?: unknown): Promise<model.ResultSet>;

  /**
   * Run quries and stream output
   *
   * @abstract
   * @param {string} query
   * @param {?any[]} [dataArgs]
   * @param {?*} [connection]
   * @returns {Promise<Readable>}
   */
  abstract stream(query: string, dataArgs?: unknown[], connection?: unknown): Promise<Readable>;

  /**
   * Run statements and stream output
   *
   * @abstract
   * @param {(sql.Statement | sql.Statement[])} query
   * @param {?*} [connection]
   * @returns {Promise<Readable>}
   */
  abstract streamStatement(query: sql.Statement | sql.Statement[], connection?: unknown): Promise<Readable>;

  /**
   * Get a new Connection
   *
   * @abstract
   * @returns {Promise<any>}
   */
  abstract getConnection(): Promise<unknown>;

  /**
   * Initialize a Transaction
   *
   * @abstract
   * @param {*} conn
   * @returns {Promise<void>}
   */
  abstract initTransaction(conn: unknown): Promise<void>;

  /**
   * Commit Transaction
   *
   * @abstract
   * @param {*} conn
   * @returns {Promise<void>}
   */
  abstract commit(conn: unknown): Promise<void>;

  /**
   * Rollback Transaction
   *
   * @abstract
   * @param {*} conn
   * @returns {Promise<void>}
   */
  abstract rollback(conn: unknown): Promise<void>;

  /**
   * Close Connection
   *
   * @abstract
   * @param {*} conn
   * @returns {Promise<void>}
   */
  abstract close(conn: unknown): Promise<void>;

  /**
   * creates a returing columns expression for the insert statement
   *
   * @abstract
   * @param {sql.INode[]} returnColumns
   * @returns {string}
   */
  abstract getReturnColumnsStr(returnColumns: sql.INode[]): string;

  abstract serializeValue(val: unknown, dataType: IEntityType<DataType>): unknown;

  abstract deSerializeValue(val: unknown, dataType: IEntityType<DataType>): unknown;

  // Comparison Operators
  /**
   * Equal Operator
   *
   * @param {string} val0
   * @param {string} val1
   * @returns {string}
   */
  eq(val0: string, val1: string): string {
    return `${val0} = ${val1}`;
  }

  /**
   * Not Equal Operator
   *
   * @param {string} val0
   * @param {string} val1
   * @returns {string}
   */
  neq(val0: string, val1: string): string {
    return `${val0} != ${val1}`;
  }

  /**
   * Less than Operator
   *
   * @param {string} val0
   * @param {string} val1
   * @returns {string}
   */
  lt(val0: string, val1: string): string {
    return `${val0} < ${val1}`;
  }

  /**
   * Greater than Operator
   *
   * @param {string} val0
   * @param {string} val1
   * @returns {string}
   */
  gt(val0: string, val1: string): string {
    return `${val0} > ${val1}`;
  }

  /**
   * Less than and Equal Operator
   *
   * @param {string} val0
   * @param {string} val1
   * @returns {string}
   */
  lteq(val0: string, val1: string): string {
    return `${val0} <= ${val1}`;
  }

  /**
   * Greator than and Equal Operator
   *
   * @param {string} val0
   * @param {string} val1
   * @returns {string}
   */
  gteq(val0: string, val1: string): string {
    return `${val0} >= ${val1}`;
  }

  // Logical Operators
  /**
   * And Operator
   *
   * @param {string[]} values
   * @returns {string}
   */
  and(values: string[]): string {
    return values
      .filter(x => x)
      .map(val => {
        return `(${val})`;
      })
      .join(' and ');
  }

  /**
   * Or Operator
   *
   * @param {string[]} values
   * @returns {string}
   */
  or(values: string[]): string {
    return values
      .filter(x => x)
      .map(val => {
        return `(${val})`;
      })
      .join(' or ');
  }

  /**
   * Not Operator
   *
   * @param {string} val0
   * @returns {string}
   */
  not(val0: string): string {
    return ` not ${val0}`;
  }

  // Inclusion Funtions
  /**
   * In Operator
   *
   * @param {string[]} values
   * @returns {string}
   */
  in(values: string[]): string {
    const lhs = values[0];
    const rhs = values.slice(1).join(', ');
    return `${lhs} in (${rhs})`;
  }

  /**
   * Between Operator
   *
   * @param {string} val0
   * @param {string} val1
   * @param {string} val2
   * @returns {string}
   */
  between(val0: string, val1: string, val2: string): string {
    return `${val0} between ${val1} and ${val2}`;
  }

  /**
   * Like Operator
   *
   * @param {string} val0
   * @param {string} val1
   * @returns {string}
   */
  like(val0: string, val1: string): string {
    return `${val0} like ${val1}`;
  }

  /**
   * Is Null Operator
   *
   * @param {string} val0
   * @returns {string}
   */
  isNull(val0: string): string {
    return `${val0} is null`;
  }

  /**
   * Is Not Null Operator
   *
   * @param {string} val0
   * @returns {string}
   */
  isNotNull(val0: string): string {
    return `${val0} is not null`;
  }

  /**
   * Exisis Operator
   *
   * @param {string} val0
   * @returns {string}
   */
  exists(val0: string): string {
    return ` exists (${val0})`;
  }

  /**
   * Limit Operator
   *
   * @param {string} size
   * @param {?string} [index]
   * @returns {string}
   */
  limit(size: string, index?: string): string {
    const indexStr = index ? `${index}, ` : '';
    return ` limit ${indexStr}${size}`;
  }

  // Arithmatic Operators
  /**
   * Plus Operator
   *
   * @param {string} val0
   * @param {string} val1
   * @returns {string}
   */
  plus(val0: string, val1: string): string {
    return `${val0} + ${val1}`;
  }

  /**
   * Minus Operator
   *
   * @param {string} val0
   * @param {string} val1
   * @returns {string}
   */
  minus(val0: string, val1: string): string {
    return `${val0} - ${val1}`;
  }

  /**
   * Multiply Opoerator
   *
   * @param {string} val0
   * @param {string} val1
   * @returns {string}
   */
  multiply(val0: string, val1: string): string {
    return `${val0} * ${val1}`;
  }

  /**
   * Devide Operator
   *
   * @param {string} val0
   * @param {string} val1
   * @returns {string}
   */
  devide(val0: string, val1: string): string {
    return `${val0} / ${val1}`;
  }

  // Sorting Operators
  /**
   * Acsending Sorting Operator
   *
   * @param {string} val0
   * @returns {string}
   */
  asc(val0: string): string {
    return `${val0} asc`;
  }

  /**
   * Descending Sorting Operator
   *
   * @param {string} val0
   * @returns {string}
   */
  desc(val0: string): string {
    return `${val0} desc`;
  }

  // Group Functions
  /**
   * Sum Operator
   *
   * @param {string} val0
   * @returns {string}
   */
  sum(val0: string): string {
    return `sum(${val0})`;
  }

  /**
   * Minimum Operator
   *
   * @param {string} val0
   * @returns {string}
   */
  min(val0: string): string {
    return `min(${val0})`;
  }

  /**
   * Maximum Opoerator
   *
   * @param {string} val0
   * @returns {string}
   */
  max(val0: string): string {
    return `max(${val0})`;
  }

  /**
   * Count Operator
   *
   * @param {string} val0
   * @returns {string}
   */
  count(val0: string): string {
    return `count(${val0})`;
  }

  /**
   * Average Operator
   *
   * @param {string} val0
   * @returns {string}
   */
  average(val0: string): string {
    return `avg(${val0})`;
  }
}
