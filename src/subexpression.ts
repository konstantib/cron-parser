import {Range, validationError} from '.';

export class Subexpression {
  increment = 1;
  range: Range = {
    start: 0,
    end: 0,
  };
  list: number[] = [];

  constructor(value: string, range: Range) {
    this.range = range;
    if (value === '*') {
      return;
    } else if (value.indexOf('/') >= 0) {
      this.increment = getIncrement(value.split('/'));
    } else if (value.indexOf('-') >= 0) {
      this.range = getCustomRange(range, value.split('-'));
    } else if (value.indexOf(',') >= 0) {
      this.list = getList(value.split(','));
    } else if (!isNaN(parseInt(value))) {
      this.range.start = parseInt(value);
      this.range.end = parseInt(value);
    } else {
      validationError('Invalid expression');
    }
  }
}

function getIncrement(incrementExpr: string[]): number {
  const increment = parseInt(incrementExpr[1]);
  if (
    incrementExpr[0] !== '*' ||
    isNaN(increment) ||
    incrementExpr.length > 2
  ) {
    validationError('Invalid increment expression');
  }

  return increment;
}

function getCustomRange(range: Range, customRange: string[]): Range {
  const rangeStart = parseInt(customRange[0]);
  const rangeEnd = parseInt(customRange[1]);
  if (isNaN(rangeStart) || isNaN(rangeEnd)) {
    validationError('Invalid range expression');
  }

  if (
    rangeStart > range.end ||
    rangeStart < range.start ||
    rangeEnd > range.end
  ) {
    validationError('Invalid range values');
  }

  return {
    start: rangeStart,
    end: rangeEnd,
  };
}

function getList(listParams: string[]): number[] {
  const list: number[] = [];
  listParams.map(item => {
    const itemInt = parseInt(item);
    if (isNaN(itemInt)) {
      validationError('Invalid list expression');
    } else {
      list.push(itemInt);
    }
  });

  return list;
}

export function printSubexpression(subEx: Subexpression): string {
  if (isListExpression(subEx.list)) {
    return subEx.list.join(' ');
  }

  return printAllRangeValues(
    subEx.range.start,
    subEx.range.end,
    subEx.increment
  );
}

function isListExpression(list: number[]): boolean {
  return list.length > 0;
}

function printAllRangeValues(
  start: number,
  end: number,
  increment: number
): string {
  let print = '';

  for (let i = start; i <= end; i += increment) {
    if (i !== start) print += ' ';
    print += i.toString();
  }

  return print;
}
