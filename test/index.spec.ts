import parse from '../src/index';

// https://crontab.guru/

const all_values = [
  'minute 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59',
  'hour 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23',
  'day_of_month 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31',
  'month 1 2 3 4 5 6 7 8 9 10 11 12',
  'day_of_week 0 1 2 3 4 5 6',
  'command /usr/bin/find',
];

const individual_values = [
  'minute 0',
  'hour 1',
  'day_of_month 2',
  'month 3',
  'day_of_week 4',
  'command /usr/bin/find',
];

const increment_values = [
  'minute 0 15 30 45',
  'hour 0 15',
  'day_of_month 1 16 31',
  'month 1 6 11',
  'day_of_week 0 3 6',
  'command /usr/bin/find',
];

const range_values = [
  'minute 1 2 3 4 5 6 7 8 9 10',
  'hour 10 11 12 13 14 15 16 17',
  'day_of_month 10 11 12 13 14 15',
  'month 8 9 10 11 12',
  'day_of_week 0',
  'command /usr/bin/find',
];

const list_values = [
  'minute 1 2 3',
  'hour 0 2 10 23',
  'day_of_month 1 15 31',
  'month 2 12',
  'day_of_week 4 5 6',
  'command /usr/bin/find',
];

describe('valid expressions', () => {
  it('all values included', () => {
    expect(parse('* * * * * /usr/bin/find')).toEqual(all_values);
  });
  it('all individual values', () => {
    expect(parse('0 1 2 3 4 /usr/bin/find')).toEqual(individual_values);
  });
  it('all values as increments', () => {
    expect(parse('*/15 */15 */15 */5 */3 /usr/bin/find')).toEqual(
      increment_values
    );
  });
  it('all values as ranges', () => {
    expect(parse('1-10 10-17 10-15 8-12 0-0 /usr/bin/find')).toEqual(
      range_values
    );
  });
  it('all values as lists', () => {
    expect(parse('1,2,3 0,2,10,23 1,15,31 2,12 4,5,6 /usr/bin/find')).toEqual(
      list_values
    );
  });
});
