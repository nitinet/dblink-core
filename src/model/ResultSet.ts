/**
 * Represents the result of a SQL query, including returned rows and optional error info.
 */
export default class ResultSet {
  rows: Record<string, unknown>[];
  error: string | null;

  constructor(rows: Record<string, unknown>[] = [], error: string | null = null) {
    this.rows = rows;
    this.error = error;
  }
}
