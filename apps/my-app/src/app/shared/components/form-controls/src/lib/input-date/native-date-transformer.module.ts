import { NgModule } from '@angular/core';
import { NativeDateTransformerDirective } from './native-date-transformer.directive';

@NgModule({
  declarations: [NativeDateTransformerDirective],
  exports: [NativeDateTransformerDirective],
})
export class NativeDateTransformerModule {}
