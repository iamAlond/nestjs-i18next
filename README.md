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
    <a href='https://img.shields.io/github/last-commit/iamalond/@iamalond/nestjs-i18next'><img src="https://img.shields.io/github/last-commit/iamalond/@iamalond/nestjs-i18next" alt="Last commit" /></a>
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

```bash
npm install nestjs-i18next
yarn add nestjs-i18next
pnpm add nestjs-i18next
```

## Usage

```typescript
import { I18NextModule } from '@iamalond/nestjs-i18next';

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

## File Structure

By default, the module uses the locale/ns.json structure. With subfolders: true, you can use recursive nesting. Keys will be resolved as namespace.subfolder.key:

```bash
src/i18n/
├── en/
│   ├── common.json
│   └── auth/
│       └── errors.json  <-- key will be "auth.errors.invalid_password"
```
