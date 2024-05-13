import { Pipe, PipeTransform } from '@angular/core';
import moment from "moment";

@Pipe({
  standalone: true,
  name: 'formatTimestamp'
})
export class FormatTimestampPipe implements PipeTransform {

  transform(value: number): string {
    console.log(value);
    return moment(new Date(Math.floor(value))).format('YYYY-MM-DD HH:mm:ss');
  }

}
