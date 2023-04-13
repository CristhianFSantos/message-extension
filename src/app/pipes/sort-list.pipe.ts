import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortList',
  pure: false,
  standalone: true,
})
export class SortListPipe implements PipeTransform {
  transform<T>(list: T[], key: string, order: 'asc' | 'desc' = 'asc'): T[] {
    if (!Array.isArray(list)) return list;

    return list.sort((a: any, b: any) => {
      if (a[key] > b[key]) {
        return order === 'asc' ? 1 : -1;
      } else if (a[key] < b[key]) {
        return order === 'asc' ? -1 : 1;
      } else {
        return 0;
      }
    });
  }
}
