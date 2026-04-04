<div align="center">
   <h1>
       <a href="#"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo"></a>
   </h1>
   🌍 Internalize your <a href="https://nestjs.com">NestJS</a> application using the nestjs-i18next module<b>
   <br/><br/>
</div>

<p align="center">
    <a href='https://img.shields.io/npm/v/@iamalond/nestjs-i18next'><img src="https://img.shields.io/npm/v/@iamalond/nestjs-i18next" alt="NPM Version" /></a>
    <a href='https://img.shields.io/npm/l/@iamalond/nestjs-i18next'><img src="https://img.shields.io/npm/l/@iamalond/nestjs-i18next" alt="NPM License" /></a>
    <a href='https://img.shields.io/npm/dm/@iamalond/nestjs-i18next'><img src="https://img.shields.io/npm/dm/@iamalond/nestjs-i18next" alt="NPM Downloads" /></a>
    <a href='https://img.shields.io/github/last-commit/iamAlond/nestjs-i18next'><img src="https://img.shields.io/github/last-commit/iamAlond/nestjs-i18next" alt="Last commit" /></a>
</p>

## About the Project

**nestjs-i18next** is an internationalization module for NestJS applications.

The project was inspired by the popular `nestjs-i18n` module, but with a major enhancement: **full type-safety for translation arguments**. No more `any` in your translations — your keys and variables are strictly typed based on your JSON files.

### Key Features:

- 🛡️ **Strict Typing**: Automatic type generation for paths and arguments.
- 🧩 **ICU Format**: Support for variables and complex pluralization (similar to the `i18next-icu` plugin).
- 🔄 **Live Reload**: Watch for translation file changes without restarting the server.
- 📂 **Recursive Namespaces**: Support for nested subfolders to organize your translations cleanly.

---

## Installation

**Node.js 18.0.0 or newer is required.**

```bash
$ npm install @iamalond/nestjs-i18next
$ yarn add @iamalond/nestjs-i18next
$ pnpm add @iamalond/nestjs-i18next
```

## Usage

After installation, we can import the `I18nextModule` into the root `AppModule`:

```typescript
import { I18nextModule } from '@iamalond/nestjs-i18next';

@Module({
    imports: [
        I18nextModule.forRoot({
            fallbackLanguage: 'en',
            throwOnMissingKey: true,
            logging: true,
            generatedTypesPath: path.join(process.cwd(), 'src/i18n/index.d.ts'),
            loadingOptions: {
                path: path.join(process.cwd(), 'src/i18n'),
                subfolders: true, // recursive loading
                watch: true
            }
        })
    ]
})
export class AppModule {}
```

Then use `I18nextService` in your service's constructor:

```typescript
import { Injectable } from '@nestjs/common';
import { I18nextService } from '@iamalond/nestjs-i18next';
/**
 * Import the types from the path you specified in 'generatedTypesPath'
 * (e.g., src/i18n/index.d.ts)
 */
import { I18nTranslations } from './i18n';

@Injectable()
export class AppService {
    // Pass I18nTranslations to the service for strict typing
    constructor(private readonly i18n: I18nextService<I18nTranslations>) {}

    getHello(): string {
        // 1. Simple translation (autocomplete for keys, when start typing!)
        const simple = this.i18n.t('common.hello');

        // 2. Translation with arguments (Typescript will REQUIRE 'args' if variables exist)
        const withArgs = this.i18n.t('common.welcome', {
            args: { name: 'Matvey iamAlond' },
            lang: 'en'
        });

        const apples = this.i18n.t('common.apples', {
            args: { count: 5 }
        });

        // 3. You can also use the 'translate' alias
        return this.i18n.translate('core.errors.notFound', {
            defaultValue: 'Not Found',
            debug: true
        });
    }
}
```

### Dynamic Translation Keys

If you need to use a dynamic key (e.g., based on an HTTP status code), use the I18nPath type. This type is also automatically generated in your generatedTypesPath and contains all valid translation paths.

```typescript
import { I18nPath, I18nTranslations } from './i18n';

@Injectable()
export class ErrorsService {
    constructor(private readonly i18n: I18nextService<I18nTranslations>) {}

    handleError(statusCode: number) {
        /**
         * Use 'as I18nPath' to tell TypeScript that this string
         * is a valid translation key.
         */
        return this.i18n.t(`errors.status.${statusCode}` as I18nPath, {
            defaultValue: 'An unexpected error occurred'
        });
    }
}
```

## File Structure

By default, the module uses the locale/ns.json structure. With subfolders: true, you can use recursive nesting. Keys will be resolved as `namespace.subfolder.key`. You can also combine both of these approaches.

```bash
src/i18n/
├── en/
│   ├── common.json
│   └── core/
│       └── errors.json  <-- key will be "core.errors.invalid_password"
└── ru/
    ├── common.json
    └── ...
```

### Examples

To support the examples above, your translation directory should look like this:

`src/i18n/en/common.json`

```json
{
    "hello": "Hello!",
    "welcome": "Welcome, {{name}}!",
    "apples": "{count, plural, =0 {No apples} one {# apple} =3 {three apples} other {# apples}}"
}
```

`src/i18n/en/core/errors.json`

```json
{
    "invalid_password": "Invalid password",
    "notFound": "Resource not found",
    "status": {
        "400": "Bad request",
        "401": "Unauthorized",
        "403": "Forbidden",
        "404": "Not found",
        "500": "Internal server error"
    }
}
```

## Key Resolution Rules

- Simple file: common.json -> key starts with common (e.g., common.hello).
- Subfolders: core/errors.json -> key starts with core.errors (e.g., core.errors.status.404).
- Arguments: Any string containing {{var}} or ICU structures like {count, plural, ...} will automatically require args in your TypeScript code.
