class Subexpression {
  all = false;
  constructor(value: string) {
    if (value === '*') {
      this.all = true;
    }
  }
  print(): string {
    return this.all ? 'every' : '';
  }
}

class Minute extends Subexpression {
  print(): string {
    let print = '';
    if (this.all) {
      for (let i = 0; i <= 59; i++) {
        if (i !== 0) print += ' ';
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

class CronExpression {
  expressions: {[key: string]: Subexpression} = {};
  command = '';

  constructor(parts: string[]) {
    parts.map((value, i) => {
      switch (i) {
        case 0:
          this.expressions['minute'] = new Minute(value);
          break;
        case 1:
          this.expressions['hour'] = new Hour(value);
          break;
        case 2:
          this.expressions['day_of_month'] = new DayOfMonth(value);
          break;
        case 3:
          this.expressions['month'] = new Month(value);
          break;
        case 4:
          this.expressions['day_of_week'] = new DayOfWeek(value);
          break;
        case 5:
          this.command = value;
          break;
        default:
          throw new Error('Invalid cron expression');
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
