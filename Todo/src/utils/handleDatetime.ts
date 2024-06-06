import {monthName} from '../constants/appInfos';

export class HandleDatetime {
  static DateTime(num: number) {
    const date = new Date(Date.now());
    return `${date.getDay()} ${
      monthName[date.getMonth()]
    }, ${date.getFullYear()}`;
  }

  static getHour(num: Date) {
    const date = new Date(num);
    const hours = date.getHours();
    return hours > 12 ? `${hours - 12} PM` : `${hours} AM`;
  }
}
