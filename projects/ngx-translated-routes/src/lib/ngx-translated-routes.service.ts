import { Injectable } from '@angular/core';
import { NavigationEnd, Route, Router, Routes, UrlSerializer } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter, firstValueFrom, Subject, takeUntil } from 'rxjs';
import { RouteTranslationConfig } from './route-translation-config';

interface RouteTranslations {
  routes?: { [key: string]: string };
}

@Injectable({
  providedIn: 'root'
})

export class NgxTranslatedRoutesService {
  private originalRoutes: Routes = [];
  private destroy$ = new Subject<void>();
  private debug: boolean = false;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private urlSerializer: UrlSerializer
  ) {
    this.originalRoutes = this.deepCloneRoutes(this.router.config);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.detectAndSetUrlLanguage();
    });
  }

  async init(): Promise<void> {
    try {
      let translatedRoutes: Routes = [];

      const emptyRoute = this.originalRoutes.find(r => r.path === '');
      if (emptyRoute) {
        translatedRoutes.push(emptyRoute);
      }

      const regularRoutes = this.originalRoutes.filter(r => r.path && r.path !== '' && r.path !== '**');

      translatedRoutes.push(...regularRoutes);

      const languages = this.translate.getLangs();

      this.debugLog('Base Routes:', regularRoutes.map(route => ({
        path: route.path,
        component: route.component?.name || 'Lazy Loaded',
        children: route.children?.map(child => ({
          path: child.path,
          component: child.component?.name || 'Lazy Loaded'
        }))
      })));

      for (const lang of languages) {
        if (lang === 'en') continue;

        try {
          const translation = await firstValueFrom<RouteTranslations>(this.translate.getTranslation(lang));
          const routeTranslations = translation.routes || {};

          const langRoutes = regularRoutes.map(route => {
            if (!route.path) return route;

            const translatedPath = routeTranslations[route.path];
            if (translatedPath && translatedPath !== route.path) {
              return this.createTranslatedRoute(route, translatedPath, routeTranslations);
            }
            return route;
          });

          this.debugLog(`Translated Routes (${lang}):`, langRoutes.map(route => ({
            path: route.path,
            component: route.component?.name || 'Lazy Loaded',
            canActivate: route.canActivate?.map(guard => guard.name),
            canActivateChild: route.canActivateChild?.map(guard => guard.name),
            canDeactivate: route.canDeactivate?.map(guard => guard.name),
            resolve: route.resolve ? Object.keys(route.resolve) : undefined,
            children: route.children?.map(child => ({
              path: child.path,
              component: child.component?.name || 'Lazy Loaded',
              canActivate: child.canActivate?.map(guard => guard.name),
              canActivateChild: child.canActivateChild?.map(guard => guard.name),
              canDeactivate: child.canDeactivate?.map(guard => guard.name),
              resolve: child.resolve ? Object.keys(child.resolve) : undefined,
            }))
          })));

          translatedRoutes.push(...langRoutes);
        } catch (error) {
          this.debugLog('Translation load failed', error);
        }
      }

      const wildcardRoute = this.originalRoutes.find(r => r.path === '**');
      if (wildcardRoute) {
        translatedRoutes.push(wildcardRoute);
      }

      this.router.resetConfig(translatedRoutes);
    } catch (error) {
      this.debugLog('Error resetting config', error);
      this.router.resetConfig(this.originalRoutes);
    }
  }

  setConfig(config: RouteTranslationConfig): void {
    this.debug = config.debug ?? false;
  }

  /**
   * Deep clones Angular routes while preserving component references and other important properties
   * @param routes The routes to clone
   * @returns A deep clone of the routes
   */
  private deepCloneRoutes(routes: Routes): Routes {
    return routes.map(route => {
      const clonedRoute: Route = {
        ...route,
        component: route.component,
        canActivate: route.canActivate ? [...(route.canActivate || [])] : undefined,
        canActivateChild: route.canActivateChild ? [...(route.canActivateChild || [])] : undefined,
        canDeactivate: route.canDeactivate ? [...(route.canDeactivate || [])] : undefined,
        data: route.data ? { ...route.data } : undefined,
        resolve: route.resolve ? { ...route.resolve } : undefined,
        children: Array.isArray(route.children) && route.children.length > 0
          ? this.deepCloneRoutes(route.children)
          : undefined,
        loadChildren: route.loadChildren,
        outlet: route.outlet,
        pathMatch: route.pathMatch,
        redirectTo: route.redirectTo,
        providers: route.providers ? [...route.providers] : undefined
      };
      return clonedRoute;
    });
  }


  private createTranslatedRoute(originalRoute: Route, translatedPath: string, translations: { [key: string]: string }): Route {
    const translatedRoute: Route = {
      ...originalRoute,
      path: translatedPath,
      data: {
        ...originalRoute.data,
        originalPath: originalRoute.path
      },
      canActivate: originalRoute.canActivate,
      canActivateChild: originalRoute.canActivateChild,
      canDeactivate: originalRoute.canDeactivate,
      resolve: originalRoute.resolve,
    };

    if (originalRoute.component) {
      translatedRoute.component = originalRoute.component;
    }

    if (originalRoute.loadChildren) {
      translatedRoute.loadChildren = originalRoute.loadChildren;
    }

    if (originalRoute.children && originalRoute.children.length > 0) {
      translatedRoute.children = this.translateChildRoutes(originalRoute.children, translations);
    }

    return translatedRoute;
  }

  private translateChildRoutes(children: Routes, translations: { [key: string]: string }): Routes {
    return children.map(child => {
      if (!child.path) return child;

      const translatedChildPath = translations[child.path];
      if (translatedChildPath && translatedChildPath !== child.path) {
        return this.createTranslatedRoute(child, translatedChildPath, translations);
      }
      return child;
    });
  }


  private detectAndSetUrlLanguage(): void {
    const url = this.router.url;

    if (url === '/') {
      if (!localStorage.getItem('lang')) {
        this.translate.use(this.translate.defaultLang);
        localStorage.setItem('lang', this.translate.defaultLang);
      }
      return;
    }


    this.findMatchingLanguages(url).then(matchingLangs => {
      if (matchingLangs.length > 1) {
        if (!localStorage.getItem('lang')) {
          const browserLang = this.getBrowserLanguage();
          this.debugLog(`Route exists in multiple languages, using browser language: ${browserLang}`);

          this.translate.use(browserLang);
          localStorage.setItem('lang', browserLang);
        }
      } else if (matchingLangs.length === 1) {
        const lang = matchingLangs[0];
        this.debugLog(`Route exists only in language: ${lang}`);
        this.translate.use(lang);
        localStorage.setItem('lang', lang);
      } else {
        this.debugLog('No matching route found, using default language');
        const defaultLang = this.translate.getDefaultLang() || 'en';
        this.translate.use(defaultLang);
        localStorage.setItem('lang', defaultLang);
      }
    });

  }

  private async findMatchingLanguages(url: string): Promise<string[]> {
    const matchingLangs: string[] = [];
    const tree = this.urlSerializer.parse(url);
    const segments = tree.root.children['primary']?.segments.map(s => s.path) || [];
  
    for (const lang of this.translate.getLangs()) {
      try {
        const langTranslations = await firstValueFrom(this.translate.getTranslation(lang)) as RouteTranslations;
        const translations = langTranslations.routes || {};
  
        const translatedPaths = Object.values(translations).map(path =>
          this.urlSerializer.parse(`/${path}`).root.children['primary']?.segments.map(s => s.path)
        ).filter(Boolean) as string[][];

        const isMatch = translatedPaths.some(pathSegments =>
          pathSegments.every(seg => segments.includes(seg))
        );
  
        if (isMatch) {
          matchingLangs.push(lang);
        }
  
      } catch (error) {
        this.debugLog(`Error loading translations for ${lang}:`, error);
      }
    }
  
    return matchingLangs;
  }
  
  

  private getBrowserLanguage(): string {
    const browserLang = navigator.language.split('-')[0];

    if (this.translate.getLangs().includes(browserLang)) {
      return browserLang;
    }

    const shortLang = browserLang.split('-')[0];
    const supportedLang = this.translate.getLangs().find(lang =>
      lang.startsWith(shortLang)
    );

    return supportedLang || this.translate.getDefaultLang() || 'en';
  }

  /**
   * Logs debug messages if debug mode is enabled
   * @param message The message to log
   * @param data Optional data to log
   */
  private debugLog(message: string, data?: any): void {
    if (this.debug) {
      if (data) {
        console.log(`[NgxTranslatedRoutes] ${message}`, data);
      } else {
        console.log(`[NgxTranslatedRoutes] ${message}`);
      }
    }
  }
}
