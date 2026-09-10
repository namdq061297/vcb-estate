import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TuiRoot } from '@taiga-ui/core';
import { LoadingComponent } from './shared/components/loading/loading.component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TuiRoot, LoadingComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('my-app');
}
// touch test Fri Aug 28 08:56:18 +07 2026
