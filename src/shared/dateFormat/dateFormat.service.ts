import dayjs from 'dayjs';
import { DateTimeFormat } from './dateTimeFormat';

export const oneHour = 60 * 60 * 1000;
export const OneWeeks = 7 * 24 * oneHour;
export const TwoWeeks = 14 * 24 * oneHour;


export class DateFormatService {

  static startDateAndEndDate(start_date?: string, end_date?: string) {
    const dayJs = dayjs(new Date());

    let startDayJs: string;
    let endDayJs: string;

    if (start_date && end_date) {
      startDayJs = dayjs(start_date).format(DateTimeFormat.YMD);
      endDayJs = dayjs(end_date).format(DateTimeFormat.YMD);
      return { startDayJs, endDayJs };
    }

    const beforeMonthDayJs = dayJs.subtract(1, 'month');
    startDayJs = beforeMonthDayJs.startOf('month').format(DateTimeFormat.YMD);
    endDayJs = beforeMonthDayJs.endOf('month').format(DateTimeFormat.YMD);

    return { startDayJs, endDayJs };
  }

  static getOneMonthAgoDateAndToday() {
    const dayJs = dayjs(new Date());
    const oneMonthAgoDayJs = dayJs.subtract(1, 'month').format(DateTimeFormat.YMD);
    const todayDayJs = dayJs.format(DateTimeFormat.YMD);

    return { oneMonthAgoDayJs, todayDayJs };
  }

  static beforeThursdayToTwoBeforeFriday() {
    const dayJs = dayjs(new Date());

    // 금주 기준 전주 목요일
    const beforeWeekThursday = dayJs.subtract(1, 'week').day(4).format('YYYY-MM-DD');

    // 금주 기준 전전주 금요일
    const twoBeforeWeekFriday = dayJs.subtract(2, 'week').day(5).format('YYYY-MM-DD');
    return {
      'beforeWeekThursday':beforeWeekThursday,
      'twoBeforeWeekFriday':twoBeforeWeekFriday,
    }
  }

  static getDateStartAndEnd(date: dayjs.Dayjs) {
    if (date) {
      const startDayJs = dayjs(date).format('YYYY-MM-DD 00:00:00');
      const endDayJs = dayjs(date).format('YYYY-MM-DD 23:59:59');
      return { startDayJs, endDayJs };
    }
  }

  static getDataBetweenMonth(start_date: string, end_date: string) {
    const startDayJs = dayjs(start_date).format(DateTimeFormat.YMD);
    const endDayJs = dayjs(end_date).format(DateTimeFormat.YMD);
    return { startDayJs, endDayJs };
  }

  static getYearMonthWeek(date: dayjs.Dayjs) {
  //  date 를 받아서 해당 년, 월, 주를 반환
    const year = date.format('YYYY');
    const month = date.format('MM');
    const week = date.format('WW');
    return { year, month, week };
  }

  static responseYesterDayStartAndEnd = () => {
    const nowDayJs = new Date();
    const yesterDayJs = dayjs(nowDayJs).subtract(1, 'day');
    const yesterdayStart = yesterDayJs.format('YYYY-MM-DD 00:00:00');
    const yesterdayEnd = yesterDayJs.format('YYYY-MM-DD 23:59:59');

    return {
      yesterdayStart,
      yesterdayEnd
    }
  }
}
