class Subexpression {
  all = false;
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

  constructor(value: string, range: Range | undefined) {
    if (range) this.range = range;
    if (value === '*') this.all = true;
    if (value.indexOf('/') >= 0) {
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
class Hour extends Subexpression {
  print(): string {
    let print = '';
    if (this.all) {
      for (let i = 0; i <= 23; i++) {
        if (i !== 0) print += ' ';
        print += i.toString();
      }
    }
    return print;
  }
}

class DayOfMonth extends Subexpression {
  print(): string {
    let print = '';
    if (this.all) {
      for (let i = 1; i <= 31; i++) {
        if (i !== 1) print += ' ';
        print += i.toString();
      }
    }
    return print;
  }
}

class Month extends Subexpression {
  print(): string {
    let print = '';
    if (this.all) {
      for (let i = 1; i <= 12; i++) {
        if (i !== 1) print += ' ';
        print += i.toString();
      }
    }
    return print;
  }
}

class DayOfWeek extends Subexpression {
  print(): string {
    let print = '';
    if (this.all) {
      for (let i = 0; i <= 6; i++) {
        if (i !== 0) print += ' ';
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
          this.expressions['hour'] = new Hour(value, undefined);
          break;
        case 2:
          this.expressions['day_of_month'] = new DayOfMonth(value, undefined);
          break;
        case 3:
          this.expressions['month'] = new Month(value, undefined);
          break;
        case 4:
          this.expressions['day_of_week'] = new DayOfWeek(value, undefined);
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
  const cronExpression = new CronExpression(expression.split(' '));
  return cronExpression.print();
}

function validationError(message: string): void {
  throw new Error(message);
}
