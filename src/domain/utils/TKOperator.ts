export enum TKOperatorComparison {
  // EQUALITY
  EQUAL = "==",
  EQUAL_STRICT = "===",
  DIFFERENT = "!=",
  DIFFERENT_STRICT = "!==",

  // COMPARISON
  GREATER = ">",
  LOWER = "<",
  GREATEREQUAL = ">=",
  LOWEREQUAL = "<="
}

export enum TKOperatorComputation {
  // BASICS
  ADDITION = "+",
  SUBSTRACTION = "-",
  DIVISION = "/",
  MULTIPLICATION = "*"
}

export function TKCompare(
  val1: string | number,
  operator: TKOperatorComparison,
  val2: string | number
): boolean {
  switch (operator) {
    case TKOperatorComparison.EQUAL:
      return val1 == val2;
    case TKOperatorComparison.EQUAL_STRICT:
      return val1 === val2;
    case TKOperatorComparison.DIFFERENT:
      return val1 != val2;
    case TKOperatorComparison.DIFFERENT_STRICT:
      return val1 !== val2;
    case TKOperatorComparison.GREATER:
      return val1 > val2;
    case TKOperatorComparison.LOWER:
      return val1 < val2;
    case TKOperatorComparison.GREATEREQUAL:
      return val1 >= val2;
    case TKOperatorComparison.LOWEREQUAL:
      return val1 < val2;
  }
}

export function TKCompute(
  val1: number,
  operator: TKOperatorComputation,
  val2: number
): number {
  switch (operator) {
    case TKOperatorComputation.ADDITION:
      return val1 + val2;
    case TKOperatorComputation.SUBSTRACTION:
      return val1 - val2;
    case TKOperatorComputation.DIVISION:
      return val1 / val2;
    case TKOperatorComputation.MULTIPLICATION:
      return val1 * val2;
  }
}
