// core/auth-config.module.ts
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {OAuthModule, AuthConfig, OAuthService} from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: 'https://auth.htl-leonding.ac.at/realms/htl-leonding',
  clientId: 'htlleonding-service',
  responseType: 'code',
  redirectUri: window.location.origin,
  scope: 'openid profile email',
  showDebugInformation: true,
  sessionChecksEnabled: true
};

@NgModule({
  imports: [
    HttpClientModule,
    OAuthModule.forRoot()
  ],
  exports: [OAuthModule]
})

export class AuthConfigModule {
  constructor(private oauthService: OAuthService) {
    this.oauthService.configure(authConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(r => {
        if (!this.oauthService.hasValidAccessToken()) {
            this.oauthService.initCodeFlow();
        }
    });
  }
}