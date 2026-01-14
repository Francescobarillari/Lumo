import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmDialog } from '../components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-root',
  styleUrls: ['./app.css'],
  standalone: true,
  imports: [RouterOutlet, ConfirmDialog],
  template: `
    <router-outlet></router-outlet>
    <app-confirm-dialog></app-confirm-dialog>
  `,

  
})
export class App{
}

  
