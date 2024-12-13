import {Component, OnInit} from '@angular/core';
import {NbMenuItem, NbMenuModule, NbMenuService, NbSidebarModule} from "@nebular/theme";
import {config} from "../../app.config";
import {AuthService} from "../../services/auth.service";
import {PromService} from "../../services/prom.service";

@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [
    NbMenuModule,
    NbSidebarModule,
  ],
  providers: [NbMenuService],
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.scss'
})
export class NavigationBarComponent implements OnInit {
    protected items: NbMenuItem[] = [];

    constructor(private authService: AuthService, private promService: PromService) {

  }

    async ngOnInit() {
        const userRoles = await this.authService.getUserRolesFromToken();
        this.items = this.filterMenuItems(config.navigation.items, userRoles);
    }

    private filterMenuItems(items: NbMenuItem[], userRoles: string[]): NbMenuItem[] {
        return items
            .map(item => {
                const filteredChildren = item.children ? this.filterMenuItems(item.children, userRoles) : [];
                const requiredRoles = (item as any).roles as string[] | undefined;
                console.log(requiredRoles)
                console.log(userRoles)
                const hasAccess = !requiredRoles || requiredRoles.some(r => userRoles.includes(r));

                console.log('hasAccess', hasAccess, item.title);

                if (!hasAccess) {
                    return null;
                }

                const result: NbMenuItem = {...item};
                if (filteredChildren.length > 0) {
                    result.children = filteredChildren;
                } else {
                    delete result.children;
                }
                return result;
            })
            .filter(item => !!item) as NbMenuItem[];
    }

}
