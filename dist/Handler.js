import * as sql from './sql/index.js';
export default class Handler {
    config;
    constructor(config) {
        this.config = config;
    }
    prepareQuery(queryStmt) {
        let query;
        const dataArgs = [];
        if (Array.isArray(queryStmt)) {
            const tempQueries = [];
            queryStmt.forEach(a => {
                if (!(a instanceof sql.Statement))
                    throw new Error('Invalid Statement');
                const { query, args } = a.eval(this);
                tempQueries.push(query);
                dataArgs.push(...args);
            });
            query = tempQueries.join('; ').concat(';');
        }
        else if (queryStmt instanceof sql.Statement) {
            const { query: stmtQuery, args } = queryStmt.eval(this);
            query = stmtQuery;
            dataArgs.push(...args);
        }
        else {
            throw new Error('Invalid Statement');
        }
        return { query, dataArgs };
    }
    binaryExpr(lhs, op, rhs) {
        return `${lhs} ${op} ${rhs}`;
    }
    wrapExpressions(values) {
        return values.filter(Boolean).map(val => `(${val})`);
    }
    eq(val0, val1) {
        return this.binaryExpr(val0, '=', val1);
    }
    neq(val0, val1) {
        return this.binaryExpr(val0, '!=', val1);
    }
    lt(val0, val1) {
        return this.binaryExpr(val0, '<', val1);
    }
    gt(val0, val1) {
        return this.binaryExpr(val0, '>', val1);
    }
    lteq(val0, val1) {
        return this.binaryExpr(val0, '<=', val1);
    }
    gteq(val0, val1) {
        return this.binaryExpr(val0, '>=', val1);
    }
    and(values) {
        return this.wrapExpressions(values).join(' and ');
    }
    or(values) {
        return this.wrapExpressions(values).join(' or ');
    }
    not(val0) {
        return ` not ${val0}`;
    }
    in(values) {
        const lhs = values[0];
        const rhs = values.slice(1).join(', ');
        return `${lhs} in (${rhs})`;
    }
    between(val0, val1, val2) {
        return `${val0} between ${val1} and ${val2}`;
    }
    like(val0, val1) {
        return this.binaryExpr(val0, 'like', val1);
    }
    isNull(val0) {
        return `${val0} is null`;
    }
    isNotNull(val0) {
        return `${val0} is not null`;
    }
    exists(val0) {
        return ` exists (${val0})`;
    }
    limit(size, index) {
        const indexStr = index ? `${index}, ` : '';
        return `limit ${indexStr}${size}`;
    }
    plus(val0, val1) {
        return this.binaryExpr(val0, '+', val1);
    }
    minus(val0, val1) {
        return this.binaryExpr(val0, '-', val1);
    }
    multiply(val0, val1) {
        return this.binaryExpr(val0, '*', val1);
    }
    devide(val0, val1) {
        return this.binaryExpr(val0, '/', val1);
    }
    asc(val0) {
        return `${val0} asc`;
    }
    desc(val0) {
        return `${val0} desc`;
    }
    sum(val0) {
        return `sum(${val0})`;
    }
    min(val0) {
        return `min(${val0})`;
    }
    max(val0) {
        return `max(${val0})`;
    }
    count(val0) {
        return `count(${val0})`;
    }
    average(val0) {
        return `avg(${val0})`;
    }
}
//# sourceMappingURL=Handler.js.map