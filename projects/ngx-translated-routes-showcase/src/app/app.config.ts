import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { provideTranslatedRoutes } from '@klubinskak/ngx-translated-routes';

export function httpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling({anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled'}), withEnabledBlockingInitialNavigation()),
    provideHttpClient(),
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      useDefaultLang: true,
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    }).providers!,
    provideTranslatedRoutes({
      baseLang: 'en',
      supportedLangs: ['en', 'fr', 'es', 'de', 'pl'],
      debug: true  
    })
  ]
};
