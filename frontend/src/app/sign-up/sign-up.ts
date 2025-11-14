import { Component } from '@angular/core';
import { FormField } from '../../components/form-field/form-field';
import { ActionButton } from '../../components/action-button/action-button';

@Component({
  selector: 'app-sign-up',
  imports: [FormField, ActionButton],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {

}
