# ngx-translated-routes

A powerful Angular library for managing translated routes in your application.

## Features

- 🔄 Automatic route translation based on language
- 🌐 Supports multiple languages
- 🔍 URL-based language detection
- 🛡️ Preserves all Angular router features (guards, resolvers, etc.)
- 🧩 Deep cloning of routes to prevent reference issues
- 🔧 Configurable debug mode
- 📦 Easy integration with existing applications

## Installation

```bash
npm install @klubinskak/ngx-translated-routes @ngx-translate/core
```

## Setup

1. Import the necessary modules in your `app.config.ts`:

```typescript
import { provideTranslatedRoutes } from '@klubinskak/ngx-translated-routes';
import { TranslateModule } from '@ngx-translate/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideTranslatedRoutes({
      baseLang: 'en',
      supportedLangs: ['en', 'fr', 'es', 'de', 'pl'],
      debug: false // Enable for development
    }),
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      useDefaultLang: true,
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    }).providers!
  ]
};
```

2. Create translation files for each language (e.g., `fr.json`):

```json
{
  "routes": {
    "users": "utilisateurs",
    "profile": "profil",
    "about-us": "a-propos"
  }
}
```

## Usage

The library automatically handles route translations based on your configuration. For example:

- English route: `/users/1`
- French route: `/utilisateurs/1`

The library will:
- Detect the language from the URL
- Set the appropriate language in the translation service
- Maintain the translated routes throughout navigation

## Configuration Options

```typescript
interface NgxTranslatedRoutesConfig {
  baseLang: string;          // Default language (e.g., 'en')
  supportedLangs: string[];  // List of supported languages
  debug?: boolean;           // Enable debug logging
}
```

## How It Works

1. **Initialization**:
   - The service deep clones your original routes
   - Loads translations for each supported language
   - Creates translated versions of your routes

2. **Navigation**:
   - Detects language from URL segments
   - Sets the appropriate language in the translation service
   - Maintains route translations during navigation

3. **Route Translation**:
   - Preserves all route properties (guards, resolvers, etc.)
   - Handles nested routes
   - Maintains route parameters

## Best Practices

1. **Translation Files**:
   - Keep route translations in separate files
   - Use consistent naming conventions
   - Include all necessary routes

2. **Route Configuration**:
   - Define all routes in your base language
   - Use meaningful route paths
   - Consider SEO implications

3. **Language Detection**:
   - The library uses URL-based detection
   - Falls back to browser language if needed
   - Stores selected language in localStorage

## Debugging

Enable debug mode in your configuration to see detailed logs:

```typescript
provideTranslatedRoutes({
  baseLang: 'en',
  supportedLangs: ['en', 'fr', 'es', 'de', 'pl'],
  debug: true
})
```

## Production Considerations

1. **Performance**:
   - Route translations are loaded once during initialization
   - Deep cloning ensures route integrity
   - Minimal impact on runtime performance

2. **SEO**:
   - Each language has its own URL
   - Search engines can index translated routes
   - Proper language tags are maintained

3. **Maintenance**:
   - Keep translation files up to date
   - Test all language combinations
   - Monitor route changes

## Contributing

Contributions are welcome! Here's how you can contribute:

1. **Fork the repository**
   - Create your own fork of the project
   - Clone it to your local machine

2. **Create a Feature Branch**
   - `git checkout -b feature/your-feature-name`

3. **Make Your Changes**
   - Implement your feature or bug fix
   - Add or update tests as necessary
   - Make sure all tests pass

4. **Follow Coding Standards**
   - Maintain consistent code style
   - Add appropriate comments
   - Update documentation if needed

5. **Commit Your Changes**
   - Use clear and descriptive commit messages
   - Reference issue numbers if applicable

6. **Submit a Pull Request**
   - Push your changes to your fork
   - Submit a pull request to the main repository
   - Describe your changes in detail

7. **Code Review**
   - Wait for code review and address any feedback

## License

MIT
