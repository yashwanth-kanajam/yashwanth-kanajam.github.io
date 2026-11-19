# Spending, utilization and cohort definitions

All measures refer to synthetic data generated for calendar year 2024 (baseline seed 17). They are demonstration metrics and are neither clinical recommendations nor estimates for a real population.

| Metric | Definition |
|---|---|
| Claim | One unique claim_id, one row per claim in the header table; not a count of visits, episodes or people |
| Line | One claim_id + line_number entry; not necessarily a distinct service encounter |
| Paid | Sum of integer header paid_cents; agrees with summed lines on the validated baseline |
| Enrolled member-month | One member enrolled for at least one day of one calendar month; each member/month pair is counted once |
| Eligible claim | Service start in 2024 and the entire service window contained within one enrollment span |
| Monthly assignment | Each eligible claim counts entirely in the month its service started (service-start assignment); a claim spanning two months is not split |
| Paid per member-month | Eligible paid cents / 100 / enrolled member-months |
| Claims per 1,000 member-months | Eligible claim count × 1,000 / enrolled member-months; not annualized |
| Cohort | Age below 55 versus 55+ on 2024-01-01; all synthetic birthdays are Jan 1 |

The monthly calendar includes all 12 months, even months without claims. Covered months with no claims have zero utilization and payment rates. Months with no enrolled members have undefined rates (SQL NULL), never an invented zero.

Overlapping enrollment spans cannot double-count member-months, because membership is determined with EXISTS and DISTINCT.

Each claim must fall within a single enrollment span. Back-to-back enrollment spans are not merged, so a claim crossing from one span into the next is not eligible.

Cohort totals use the same eligibility rules and reconcile with monthly totals. Cohort rates must be recalculated as sum(numerator)/sum(denominator), never summed or averaged without weights. The Tableau sheet shows each cohort separately instead of an unweighted combined rate.

The generator ends services before November on purpose and uses fixed receipt and payment lags. Apparent seasonality, age differences or provider differences are generator artifacts and are not evidence of healthcare behavior.

Claims are not visits, so these outputs should never be renamed visit counts.

Analytics run only on the baseline dataset that passed the SQL validation checks and an independent verification. Copies with deliberately added defects are used only to evaluate the checks. They do not feed the spending or utilization measures.

SQL source: utilization.sql and cohorts.sql under src/claims_quality/sql/.
