import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimezoneService {
  offSetToTimezone(offset: number) {
    offset = (offset * -1)
    let hours, mins, sign
    if (offset % 60 == 0) {
      hours = offset / 60
      mins = '00'
    } else {
      let sep = JSON.stringify(offset / 60).split('.')
      hours = sep[0]
      mins = parseInt(sep[1]) * 6
    }
    if (hours > 0) {
      sign = '+'
    }
    else {
      sign = '-'
      hours = hours * -1
    }
    let timezone = `${hours}${mins}`
    if (timezone.length === 3) {
      timezone = `0${timezone}`
    }
    timezone = `${sign}${timezone}`
    return timezone
  }

  constructor() { }
}
