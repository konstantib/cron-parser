import {Subexpression, printSubexpression} from './subexpression';

export interface Range {
  start: number;
  end: number;
}

class CronExpression {
  expressions: {[key: string]: Subexpression} = {};
  command = '';

  ranges: {[key: string]: Range} = {
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
          this.createSubexpression('minute', value);
          break;
        case 1:
          this.createSubexpression('hour', value);
          break;
        case 2:
          this.createSubexpression('day_of_month', value);
          break;
        case 3:
          this.createSubexpression('month', value);
          break;
        case 4:
          this.createSubexpression('day_of_week', value);
          break;
        case 5:
          this.command = value;
          break;
        default:
          validationError('Invalid cron expression');
      }
    });
  }

  createSubexpression(name: string, value: string) {
    this.expressions[name] = new Subexpression(value, this.ranges[name]);
  }

  print(): string[] {
    const print: string[] = [];
    Object.entries(this.expressions).forEach(([key, value]) =>
      print.push(key + ' ' + printSubexpression(value))
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

export function validationError(message: string): void {
  throw new Error(message);
}

console.log(parse(process.argv.slice(2)[0]));
