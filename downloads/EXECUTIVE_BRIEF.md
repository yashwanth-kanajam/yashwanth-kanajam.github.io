# Claims reporting: check the aggregation grain

Synthetic claims, seed 17, calendar 2024. No real patient or payer data.

The validated paid total is $15,905.27. Summing header payments after a one-to-many line join produces $37,011.02. The $21,105.75 difference is a reporting error, not savings.

Header totals, line totals, and a correctly preaggregated join agree. The workflow also evaluates duplicate records, broken references, date sequences, and financial reconciliation against controlled defect labels.

Before interpreting utilization, define the grain and denominator, reconcile payments, and investigate validation failures. Synthetic results do not establish clinical validity or real-world detection performance.
