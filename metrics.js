(function (root) {
  'use strict';
  const sum = (rows, field) => rows.reduce((total, row) => total + row[field], 0);
  const ratio = (a, b, scale = 1) => b ? a / b * scale : null;
  function summarize(rows) {
    const paid = sum(rows, 'paid_cents'), months = sum(rows, 'member_months');
    const claims = sum(rows, 'claims');
    return { paid_cents: paid, member_months: months, claims,
      paid_per_member_month: ratio(paid, months, 0.01),
      claims_per_1000_member_months: ratio(claims, months, 1000) };
  }
  function selectMonths(rows, start, end) {
    if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end >= rows.length || start > end) {
      throw new RangeError('Choose a start month on or before the end month.');
    }
    return rows.slice(start, end + 1);
  }
  function summarizeJoin(groups, included) {
    if (!Array.isArray(included) || included.some(n => ![1,2,3].includes(n))) throw new RangeError('Unsupported line group.');
    const rows = groups.filter(row => included.includes(row.lines_per_claim));
    const correct = sum(rows, 'paid_cents'), incorrect = sum(rows, 'joined_paid_cents');
    return {rows, claims:sum(rows, 'claims'), paid_cents:correct, joined_paid_cents:incorrect,
      difference_cents:incorrect-correct, overstatement:ratio(incorrect-correct, correct, 100)};
  }
  const api = {sum, ratio, summarize, selectMonths, summarizeJoin};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.PortfolioMetrics = api;
})(typeof window !== 'undefined' ? window : globalThis);
