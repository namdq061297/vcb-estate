import { Directive, Injectable } from '@angular/core';
import { TuiControlValueTransformer, TuiDay } from '@taiga-ui/cdk';
import { TUI_DATE_VALUE_TRANSFORMER } from '@taiga-ui/kit';

type From = TuiDay | null;

type To = Date | null;

@Injectable()
class NativeDateTransformer implements TuiControlValueTransformer<From, To> {
  fromControlValue(controlValue: To): From {
    return controlValue && TuiDay.fromLocalNativeDate(controlValue);
  }

  toControlValue(componentValue: From): To {
    return componentValue?.toLocalNativeDate() || null;
  }
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: `tui-input-date[toNativeDate]`,
  providers: [
    {
      provide: TUI_DATE_VALUE_TRANSFORMER,
      useClass: NativeDateTransformer,
    },
  ],
})
export class NativeDateTransformerDirective {}
