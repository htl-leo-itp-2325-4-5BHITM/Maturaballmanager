import { Component } from '@angular/core';
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatAnchor, MatIconButton} from "@angular/material/button";
import {Router, RouterLink} from "@angular/router";
import {NgOptimizedImage} from "@angular/common";
import {MatToolbar} from "@angular/material/toolbar";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    MatMenu,
    MatMenuItem,
    MatAnchor,
    RouterLink,
    NgOptimizedImage,
    MatToolbar,
    MatMenuTrigger,
    MatIconButton
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
  userName = 'Max Mustermann';
  userProfileImageUrl = 'user-profile-svgrepo-com.svg';

  constructor(private authService: AuthService, private router: Router) {

  }

  logOut() {
      this.authService.logout();
      this.router.navigate(['/login']);
  }
}
