import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-my-profile-details',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './my-profile-details.component.html',
  styleUrl: './my-profile-details.component.css'
})
export class MyProfileDetailsComponent {}
