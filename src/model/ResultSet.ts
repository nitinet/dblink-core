/**
 * Represents the result of a SQL query, including returned rows and optional error info.
 */
export default class ResultSet {
  rows: Record<string, unknown>[];

  constructor(rows: Record<string, unknown>[] = []) {
    this.rows = rows;
  }
}
