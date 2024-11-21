import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'industryStatus'
})
export class IndustryStatusPipe implements PipeTransform {
  transform(industry: string): string {
    switch(industry.toLowerCase()) {
      case 'technik':
        return 'success';
      case 'finanzen':
        return 'info';
      case 'gesundheit':
        return 'warning';
      default:
        return 'basic';
    }
  }
}
