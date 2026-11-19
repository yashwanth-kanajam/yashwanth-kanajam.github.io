window.ACCESS_SCENARIOS = [
  {
    "name": "Baseline",
    "rule": "Physician supply below the county median (78.8 per 100,000), and poverty at or above 9.98% or age 65+ at or above 17.47% (the population-weighted state figures).",
    "selected": [
      "Bristol",
      "Dukes",
      "Essex",
      "Franklin",
      "Hampden",
      "Plymouth"
    ],
    "added": [],
    "removed": []
  },
  {
    "name": "Stricter physician-supply cutoff",
    "rule": "Supply below the 40th percentile of counties (71.0 per 100,000). Same poverty/age condition as the baseline.",
    "selected": [
      "Bristol",
      "Dukes",
      "Franklin",
      "Hampden",
      "Plymouth"
    ],
    "added": [],
    "removed": [
      "Essex"
    ]
  },
  {
    "name": "Broader physician-supply cutoff",
    "rule": "Supply below the 60th percentile of counties (92.5 per 100,000). Same poverty/age condition as the baseline.",
    "selected": [
      "Barnstable",
      "Bristol",
      "Dukes",
      "Essex",
      "Franklin",
      "Hampden",
      "Plymouth"
    ],
    "added": [
      "Barnstable"
    ],
    "removed": []
  },
  {
    "name": "2022 physician counts",
    "rule": "2022 physician counts with the same population, compared with the recalculated 2022 county median (81.9 per 100,000). Same poverty/age condition.",
    "selected": [
      "Bristol",
      "Dukes",
      "Essex",
      "Franklin",
      "Hampden",
      "Plymouth"
    ],
    "added": [],
    "removed": []
  },
  {
    "name": "Poverty condition only",
    "rule": "Baseline supply cutoff, with poverty at or above 9.98% required. Age is not used.",
    "selected": [
      "Bristol",
      "Franklin",
      "Hampden"
    ],
    "added": [],
    "removed": [
      "Dukes",
      "Essex",
      "Plymouth"
    ]
  },
  {
    "name": "Age condition only",
    "rule": "Baseline supply cutoff, with age 65+ at or above 17.47% required. Poverty is not used.",
    "selected": [
      "Dukes",
      "Essex",
      "Franklin",
      "Hampden",
      "Plymouth"
    ],
    "added": [],
    "removed": [
      "Bristol"
    ]
  },
  {
    "name": "Lower estimates (margin of error)",
    "rule": "Baseline supply cutoff. Each county's poverty and age percentages are lowered by their approximate 90% ACS margin of error before comparing with the state figures.",
    "selected": [
      "Bristol",
      "Dukes",
      "Essex",
      "Franklin",
      "Hampden",
      "Plymouth"
    ],
    "added": [],
    "removed": []
  },
  {
    "name": "Upper estimates (margin of error)",
    "rule": "Baseline supply cutoff. Each county's poverty and age percentages are raised by their approximate 90% ACS margin of error before comparing with the state figures.",
    "selected": [
      "Bristol",
      "Dukes",
      "Essex",
      "Franklin",
      "Hampden",
      "Plymouth"
    ],
    "added": [],
    "removed": []
  }
];
