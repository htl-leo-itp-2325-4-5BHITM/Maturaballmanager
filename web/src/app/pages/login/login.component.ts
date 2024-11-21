import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NbButtonModule, NbCardModule, NbInputModule, NbLayoutModule, NbToastrService} from '@nebular/theme';
import {AuthService} from '../../services/auth.service';
import {NgOptimizedImage} from "@angular/common";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    standalone: true,
    imports: [
        NbLayoutModule,
        NbCardModule,
        ReactiveFormsModule,
        NbInputModule,
        NbButtonModule,
        NgOptimizedImage,
    ],
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    loginForm: FormGroup;
    private authService: AuthService = inject(AuthService);

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private toastrService: NbToastrService
    ) {
        this.loginForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
        });
    }

    login() {
        if (this.loginForm.valid) {
            this.authService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe({
                next: async () => {
                    await this.router.navigate(['/dashboard']);
                    this.toastrService.success('Login successful', 'Success');
                },
                error: () => {
                    this.toastrService.danger('Login failed. Please check your credentials.', 'Error');
                }
            });
        }
    }
}