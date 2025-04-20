import { InjectionToken } from '@angular/core';

export interface RouteTranslationConfig {
  baseLang?: string;
  debug?: boolean;
  supportedLangs?: string[];
  priorityLangs?: string[];
}

export const ROUTE_TRANSLATION_CONFIG = new InjectionToken<RouteTranslationConfig>('ROUTE_TRANSLATION_CONFIG');
