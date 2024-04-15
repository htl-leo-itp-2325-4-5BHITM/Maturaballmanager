import { Component } from '@angular/core';
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatAnchor, MatIconButton} from "@angular/material/button";
import {RouterLink} from "@angular/router";
import {NgOptimizedImage} from "@angular/common";
import {MatToolbar} from "@angular/material/toolbar";

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
}
