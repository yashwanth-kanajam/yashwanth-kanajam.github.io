# Claims analysis: validation summary

Synthetic data only. No real patient, payer, or employer records.

- Controlled defect scenarios are evaluated against isolated expected labels, alongside valid lookalike cases that must not be flagged.
- Header totals, independently summed line totals, and a correctly preaggregated join reconcile to the same amount.
- Monthly and cohort totals reconcile to the same validated baseline; covered months with no claims retain zero activity.
- The workflow is covered by an automated test suite and verified by installing the package into a clean environment.
- The packaged Tableau workbook opens successfully, and its four panels reconcile to the validated source results.

Baseline seed 17: 101 claims, 24 members, 288 member-months.
Correct paid: 1,590,527 USD cents. Incorrect header-line join: 3,701,102 cents.
The 2,110,575-cent difference is a synthetic reporting error, not realized savings.
