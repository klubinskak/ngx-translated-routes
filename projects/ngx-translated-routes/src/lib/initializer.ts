import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { RouteTranslationConfig } from './route-translation-config';
import { NgxTranslatedRoutesService } from './ngx-translated-routes.service';

export async function routeTranslationInitializer(
  translate: TranslateService,
  routeService: NgxTranslatedRoutesService,
  config: RouteTranslationConfig
): Promise<void> {
  const baseLang = config.baseLang || 'en';
  const supportedLangs = config.supportedLangs?.length ? config.supportedLangs : ['en'];

  translate.addLangs(supportedLangs);
  translate.setDefaultLang(baseLang);
  routeService.setConfig(config);

  await firstValueFrom(translate.use(baseLang));
  await routeService.init();
}
