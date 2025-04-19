import { APP_INITIALIZER, EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { RouteTranslationConfig, ROUTE_TRANSLATION_CONFIG } from './route-translation-config';
import { TranslateService } from '@ngx-translate/core';
import { NgxTranslatedRoutesService } from './ngx-translated-routes.service';
import { routeTranslationInitializer } from './initializer';

export function provideTranslatedRoutes(config: RouteTranslationConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: ROUTE_TRANSLATION_CONFIG, useValue: config },
    NgxTranslatedRoutesService,
    {
      provide: APP_INITIALIZER,
      useFactory: routeTranslationInitializerFactory,
      deps: [TranslateService, NgxTranslatedRoutesService, ROUTE_TRANSLATION_CONFIG],
      multi: true
    }
  ]);
}

export function routeTranslationInitializerFactory(
  translate: TranslateService,
  routeService: NgxTranslatedRoutesService,
  config: RouteTranslationConfig
): () => Promise<void> {
  return () => routeTranslationInitializer(translate, routeService as any, config);
}
