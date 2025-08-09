/**
 * Calculates salary after layered (progressive) taxes.
 * @param {Array<[number, number]>} brackets - Array of [limit, rate] pairs. 
 *     limit: upper bound of the bracket (null or Infinity for no upper limit)
 *     rate: tax rate for that bracket (0–1)
 * @param {number} salary - Total income before taxes.
 * @returns {number} Net salary after tax.
 */
export function calculateNetSalary(brackets, salary) {
  let remaining = salary;
  let prevLimit = 0;
  let tax = 0;

  for (const [limit, rate] of brackets) {
    const upperLimit = limit ?? Infinity; // handle null or undefined as unlimited
    const taxable = Math.min(remaining, upperLimit - prevLimit);
    if (taxable <= 0) break;

    tax += taxable * rate;
    remaining -= taxable;
    prevLimit = upperLimit;
  }

  return salary - tax;
}

/**
 * Calculates salary after layered (progressive) taxes.
 * @param {Array<[number, number]>} brackets - Array of [limit, rate] pairs. 
 *     limit: upper bound of the bracket (null or Infinity for no upper limit)
 *     rate: tax rate for that bracket (0–1)
 * @param {number} salary - Total income before taxes.
 * @returns {number} Net salary after tax.
 */
export function calculateRelativeTaxPercentage(brackets, salary) {
  let remaining = salary;
  let prevLimit = 0;
  let tax = 0;

  for (const [limit, rate] of brackets) {
    const upperLimit = limit ?? Infinity; // handle null or undefined as unlimited
    const taxable = Math.min(remaining, upperLimit - prevLimit);
    if (taxable <= 0) break;

    tax += taxable * rate;
    remaining -= taxable;
    prevLimit = upperLimit;
  }

  return tax / salary;
}

// Example usage:
const taxBrackets = [
  [10000, 0.1],    // 10% on the first $10k
  [30000, 0.2],    // 20% on the next $20k (10k–30k)
  [Infinity, 0.3]  // 30% on the rest
];

console.log(calculateNetSalary(taxBrackets, 45000)); 
// → 35500
console.log(calculateRelativeTaxPercentage(taxBrackets, 45000)); 
// -> 0.21111