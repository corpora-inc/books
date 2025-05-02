Filename format: `XX-YY-ZZ-title.md`

Look carefully at the filename to determine the correct header level and what you should return.

For Intro files, use only the single header of the correct level. Only if ZZ not equal to 00, you should return a full lesson with subheaders.

Rules:
- `XX-00-00` → `#` (H1) **Section Intro**
  - Only one header - `#`.
  - No subheaders.
  - Short overview, may include blockquotes.
  - Not a full lesson, just the introduction and a brief explanation.

- `XX-YY-00` → `##` (H2) **Subsection Intro**
  - Only one header - `##`.
  - No subheaders.
  - Short overview of key concepts
  - Not a full lesson, just the subheader and a brief explanation.

- `XX-YY-ZZ` (ZZ $\neq$ 00) → `###` (H3) **Lesson**
  - Start from `###`
  - Include subheaders (`####`, `#####`, etc.)
  - Full structured lesson with comprehensive explanations, examples, and practice problems.

Strictly follow these header levels to maintain TOC structure.

This book has:

    "00-00-00-introduction.md"
    "01-00-00-numbers-and-operations.md"
    "01-01-00-place-value.md"
    "01-01-01-reading-writing-numbers.md"
    "01-01-02-expanded-form.md"
    "01-01-03-comparing-ordering-numbers.md"
    "01-02-00-addition-subtraction.md"
    "01-02-01-two-digit-addition.md"
    "01-02-02-two-digit-subtraction.md"
    "01-02-03-three-digit-addition.md"
    "01-02-04-three-digit-subtraction.md"
    "01-03-00-multiplication.md"
    "01-03-01-multiplication-as-repeated-addition.md"
    "01-03-02-multiplication-facts-0-5.md"
    "01-03-03-multiplication-facts-6-10.md"
    "01-03-04-word-problems.md"
    "01-03-05-properties-of-multiplication.md"
    "01-04-00-division.md"
    "01-04-01-division-as-sharing.md"
    "01-04-02-division-facts-0-5.md"
    "01-04-03-division-facts-6-10.md"
    "01-04-04-remainders.md"
    "01-04-05-multiplication-division-relationship.md"
    "02-00-00-fractions.md"
    "02-01-00-understanding-fractions.md"
    "02-01-01-naming-fractions.md"
    "02-01-02-comparing-fractions.md"
    "02-01-03-equivalent-fractions.md"
    "02-02-00-fractions-on-a-number-line.md"
    "02-02-01-placing-fractions.md"
    "02-02-02-fractions-between-whole-numbers.md"
    "02-02-03-graphing-fractions.md"
    "02-03-00-adding-subtracting-fractions.md"
    "02-03-01-like-denominators.md"
    "02-03-02-mixed-numbers.md"
    "02-03-03-fraction-word-problems.md"
    "03-00-00-measurement-data.md"
    "03-01-00-length.md"
    "03-01-01-inches-and-feet.md"
    "03-01-02-centimeters-and-meters.md"
    "03-01-03-length-conversion.md"
    "03-02-00-weight-and-mass.md"
    "03-02-01-ounces-and-pounds.md"
    "03-02-02-grams-and-kilograms.md"
    "03-02-03-weight-conversion.md"
    "03-03-00-volume-and-capacity.md"
    "03-03-01-cups-pints-quarts-gallons.md"
    "03-03-02-milliliters-and-liters.md"
    "03-03-03-volume-conversion.md"
    "03-04-00-time.md"
    "03-04-01-reading-clocks.md"
    "03-04-02-am-and-pm.md"
    "03-04-03-elapsed-time.md"
    "03-05-00-money.md"
    "03-05-01-identifying-coins-and-bills.md"
    "03-05-02-making-change.md"
    "03-06-00-data-and-graphs.md"
    "03-06-01-reading-bar-graphs.md"
    "03-06-02-making-bar-graphs.md"
    "03-06-03-line-plots.md"
    "04-00-00-geometry.md"
    "04-01-00-plane-shapes.md"
    "04-01-01-triangles-quadrilaterals.md"
    "04-01-02-regular-vs-irregular.md"
    "04-01-03-symmetry.md"
    "04-02-00-solid-shapes.md"
    "04-02-01-cubes-cylinders-cones.md"
    "04-02-02-sphere-prism-pyramid.md"
    "04-03-00-perimeter-and-area.md"
    "04-03-01-finding-perimeter.md"
    "04-03-02-finding-area.md"
    "04-04-00-lines-angles.md"
    "04-04-01-types-of-angles.md"
    "04-04-02-parallel-and-perpendicular.md"
    "05-00-00-algebraic-thinking.md"
    "05-01-00-number-patterns.md"
    "05-01-01-even-and-odd-numbers.md"
    "05-01-02-skip-counting.md"
    "05-02-00-missing-numbers.md"
    "05-02-01-missing-addends.md"
    "05-02-02-missing-factors.md"
    "05-03-00-word-problems.md"
    "05-03-01-keywords-in-word-problems.md"
    "05-03-02-multi-step-problems.md"
    "06-00-00-probability-logic.md"
    "06-01-00-introduction-to-probability.md"
    "06-01-01-likely-vs-unlikely.md"
    "06-01-02-certain-vs-impossible.md"
    "06-01-03-probability-experiments.md"
    "06-02-00-logic-and-reasoning.md"
    "06-02-01-if-then-statements.md"
    "06-02-02-true-or-false.md"
    "07-00-00-review.md"
    "07-01-00-mixed-practice.md"
    "07-01-01-mixed-addition-subtraction.md"
    "07-01-02-mixed-multiplication-division.md"
    "07-01-03-mixed-word-problems.md"
    "07-02-00-math-games.md"
    "07-02-01-multiplication-bingo.md"
    "07-02-02-geometry-scavenger-hunt.md"
    "07-03-00-final-test.md"
    "07-03-01-practice-test.md"
    "07-03-02-real-test.md"

Try to provide unique insight and be specific for each lesson knowing that the student is in grade 3 and that other lessons may cover similar topics. Don't try to cover everything in one lesson or be redundant. Try to delve deep into the specific topic at hand and not be too general.
