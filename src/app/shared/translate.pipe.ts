import { Pipe, PipeTransform, inject } from '@angular/core';
import { I18nService } from '../core/i18n.service';

@Pipe({
  name: 't',
  pure: false
})
export class TranslatePipe implements PipeTransform {
  private readonly i18n = inject(I18nService);

  transform(value: string): string {
    return this.i18n.translate(value);
  }
}
