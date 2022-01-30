import parse from '../src/index';

// https://crontab.guru/

const actual = {
  minute: 'every',
  hour: 'every',
  day_of_month: 'every',
  month: 'every',
  day_of_week: 'every',
  command: '/usr/bin/find',
};

describe('valid expressions', () => {
  it('at every minute', () => {
    expect('* * * * * /usr/bin/find').toEqual(JSON.stringify(actual));
  });
});
