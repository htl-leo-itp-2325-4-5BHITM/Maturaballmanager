import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {AuthService} from "../../services/auth.service";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {FormsModule} from "@angular/forms";
import {NgIf, NgOptimizedImage} from "@angular/common";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    standalone: true,
    imports: [
        MatFormField,
        MatButton,
        MatInput,
        MatLabel,
        MatProgressSpinner,
        FormsModule,
        NgIf,
        NgOptimizedImage
    ],
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    username: string = '';
    password: string = '';
    isLoading = false;

    constructor(
        private authService: AuthService,
        private router: Router,
        private snackBar: MatSnackBar
    ) {}

    // In deiner LoginComponent
    login(): void {
        this.authService.login(this.username, this.password).subscribe(success => {
            console.log('Logged in successfully');
            this.router.navigate(['/dashboard']);
        }, error => {
            console.error('Login failed', error);
        });
    }

}
