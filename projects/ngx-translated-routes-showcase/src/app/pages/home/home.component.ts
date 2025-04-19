import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="container">
      <h1>{{ 'app.welcome' | translate }}</h1>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }
  `]
})
export class HomeComponent {} 