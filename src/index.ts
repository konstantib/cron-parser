class Subexpression {
  every = false;
  constructor(value: string) {
    if (value === '*') {
      this.every = true;
    }
  }
  print(): string {
    return this.every ? 'every' : '';
  }
}

class CronExpression {
  minute: Subexpression | undefined;
  hour: Subexpression | undefined;
  day_of_month: Subexpression | undefined;
  month: Subexpression | undefined;
  day_of_week: Subexpression | undefined;
  command: string | undefined;

  constructor(expressions: string[]) {
    expressions.map((value, i) => {
      switch (i) {
        case 0:
          this.minute = new Subexpression(value);
          break;
        case 1:
          this.hour = new Subexpression(value);
          break;
        case 2:
          this.day_of_month = new Subexpression(value);
          break;
        case 3:
          this.month = new Subexpression(value);
          break;
        case 4:
          this.day_of_week = new Subexpression(value);
          break;
        case 5:
          this.command = value;
          break;
      }
    });
  }

  print(): string[] {
    const print: string[] = [];

    print.push('minute ' + this.minute?.print());
    print.push('hour ' + this.hour?.print());
    print.push('day_of_month ' + this.day_of_month?.print());
    print.push('day_of_week ' + this.day_of_week?.print());
    print.push('command ' + this.command);

    return print;
  }
}

export default function parse(expression: string): string[] {
  const cronExpression = new CronExpression(expression.split(' '));
  return cronExpression.print();
}
