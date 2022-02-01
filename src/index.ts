class Subexpression {
  increment = 1;
  range: Range = {
    start: 0,
    end: 0,
  };
  customRange = {
    enabled: false,
    start: 0,
    end: 0,
  };
  list: number[] = [];

  constructor(value: string, range: Range) {
    this.range = range;
    if (value === '*') {
      return;
    } else if (value.indexOf('/') >= 0) {
      const incrementExpr = value.split('/');
      const increment = parseInt(incrementExpr[1]);
      if (
        incrementExpr[0] !== '*' ||
        isNaN(increment) ||
        incrementExpr.length > 2
      ) {
        validationError('Invalid increment expression');
      }
      this.increment = increment;
    } else if (value.indexOf('-') >= 0) {
      const range = value.split('-');
      const rangeStart = parseInt(range[0]);
      const rangeEnd = parseInt(range[1]);
      if (isNaN(rangeStart) || isNaN(rangeEnd)) {
        validationError('Invalid range expression');
      }
      this.customRange.enabled = true;
      this.customRange.start = rangeStart;
      this.customRange.end = rangeEnd;
    } else if (value.indexOf(',') >= 0) {
      const listParams = value.split(',');
      listParams.map(item => {
        const itemInt = parseInt(item);
        if (isNaN(itemInt)) {
          validationError('Invalid list expression');
        } else {
          this.list.push(itemInt);
        }
      });
    } else if (!isNaN(parseInt(value))) {
      this.range.start = parseInt(value);
      this.range.end = parseInt(value);
    } else {
      validationError('Invalid expression');
    }
  }
  print(): string {
    let print = '';

    if (this.customRange.enabled) {
      if (
        this.customRange.start > this.range.end ||
        this.customRange.start < this.range.start ||
        this.customRange.end > this.range.end
      ) {
        validationError('Invalid range values');
      }
      this.range.start = this.customRange.start;
      this.range.end = this.customRange.end;
    }

    if (this.list.length > 0) {
      print = this.list.join(' ');
    } else {
      for (let i = this.range.start; i <= this.range.end; i += this.increment) {
        if (i !== this.range.start) print += ' ';
        print += i.toString();
      }
    }

    return print;
  }
}

interface Range {
  start: number;
  end: number;
}

class CronExpression {
  expressions: {[key: string]: Subexpression} = {};
  command = '';

  types: {[key: string]: Range} = {
    minute: {
      start: 0,
      end: 59,
    },
    hour: {
      start: 0,
      end: 23,
    },
    day_of_month: {
      start: 1,
      end: 31,
    },
    month: {
      start: 1,
      end: 12,
    },
    day_of_week: {
      start: 0,
      end: 6,
    },
  };

  constructor(parts: string[]) {
    parts.map((value, i) => {
      switch (i) {
        case 0:
          this.expressions['minute'] = new Subexpression(
            value,
            this.types['minute']
          );
          break;
        case 1:
          this.expressions['hour'] = new Subexpression(
            value,
            this.types['hour']
          );
          break;
        case 2:
          this.expressions['day_of_month'] = new Subexpression(
            value,
            this.types['day_of_month']
          );
          break;
        case 3:
          this.expressions['month'] = new Subexpression(
            value,
            this.types['month']
          );
          break;
        case 4:
          this.expressions['day_of_week'] = new Subexpression(
            value,
            this.types['day_of_week']
          );
          break;
        case 5:
          this.command = value;
          break;
        default:
          validationError('Invalid cron expression');
      }
    });
  }

  print(): string[] {
    const print: string[] = [];
    Object.entries(this.expressions).forEach(([key, value]) =>
      print.push(key + ' ' + value.print())
    );
    print.push('command ' + this.command);

    return print;
  }
}

export default function parse(expression: string): string[] {
  const print: string[] = [];
  try {
    const cronExpression = new CronExpression(expression.split(' '));
    print.push(...cronExpression.print());
  } catch (e) {
    if (e instanceof Error) {
      print.push(e.message);
    }
  }

  return print;
}

function validationError(message: string): void {
  throw new Error(message);
}
