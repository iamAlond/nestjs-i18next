import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { BehaviorSubject, distinctUntilChanged, Observable } from 'rxjs';

import { I18nextModuleOptions, TranslateOptions } from './nestjs-i18next';
import { I18nextJsonLoader } from './nestjs-i18next.json-loader';
import { MODULE_OPTIONS_TOKEN } from './nestjs-i18next.module-definition';

@Injectable()
export class I18nextService<T extends { key: string }> implements OnModuleInit {
	private readonly logger = new Logger(I18nextService.name);
	private readonly translations$ = new BehaviorSubject<Record<string, any>>({});

	constructor(
		@Inject(MODULE_OPTIONS_TOKEN) protected readonly options: I18nextModuleOptions,
		private readonly jsonLoader: I18nextJsonLoader
	) {}

	onModuleInit() {
		this.jsonLoader.onChange(() => {
			this.refresh();
		});

		this.refresh();
	}

	public refresh() {
		const loaded = this.jsonLoader.parseTransitions();

		if (loaded) {
			this.translations$.next(loaded);

			if (this.options.logging) {
				this.logger.log(
					`Translations updated. Loaded languages: ${Object.keys(loaded).length}`
				);
			}
		}
	}

	public get state$(): Observable<Record<string, any>> {
		return this.translations$
			.asObservable()
			.pipe(
				distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
			);
	}

	private get currentTranslations(): Record<string, any> {
		return this.translations$.getValue();
	}

	public getSupportedLanguages(): string[] {
		return Object.keys(this.currentTranslations);
	}

	public getTranslations() {
		return this.currentTranslations;
	}

	public getTranslationsForNamespace(lang: string) {
		return this.currentTranslations[lang];
	}

	public translate<P extends T['key']>(key: P, options?: TranslateOptions<P, T>): string {
		return this.t(key, options);
	}

	public t<P extends T['key']>(key: P, options?: TranslateOptions<P, T>): string {
		const lang = options?.lang ?? this.options.fallbackLanguage;

		const translations = this.currentTranslations[lang] ?? this.options.fallbackLanguage;

		if (!translations) {
			return this.handleMissingKey(key, lang);
		}

		const keys = key.split('.');
		let result = translations;

		for (const k of keys) {
			result = result?.[k];
			if (result === undefined) break;
		}

		if (result === undefined) {
			return this.handleMissingKey(key, lang);
		}

		if (typeof result === 'string') {
			const args = options?.args;

			if (args) {
				return this.replaceArgs(result, args, lang);
			}

			return result;
		}

		return String(result);
	}

	private replaceArgs(text: string, args: Record<string, any>, lang: string): string {
		// 1. Find ICU plural: {key, plural, =0 {..} one {..} few {..} many {..} other {..}}
		const icuRegex = /{(\w+),\s*plural,\s*([^{}]*({[^{}]*}[^{}]*)*)}/g;

		const processedText = text.replace(icuRegex, (match, propName, rulesString) => {
			const value = args[propName];
			if (value === undefined) return match;

			// Extract keys
			const ruleRegex = /(=?\w+)\s*{([^}]+)}/g;
			const rules: Record<string, string> = {};
			let m;
			while ((m = ruleRegex.exec(rulesString)) !== null) {
				rules[m[1]] = m[2];
			}

			// Select keys (=0, =1)
			if (rules[`=${value}`]) return rules[`=${value}`];

			// Use categories (one, few, many, other)
			const pluralCategory = new Intl.PluralRules(lang).select(value);
			const result = rules[pluralCategory] || rules['other'] || '';

			// Use # in plural for value
			return result.replace(/#/g, String(value));
		});

		// 2. Keys {{key}}
		return processedText.replace(/{{(\w+)}}/g, (match, key) => {
			return args[key] !== undefined ? String(args[key]) : match;
		});
	}

	private handleMissingKey(key: string, lang: string): string {
		if (this.options.throwOnMissingKey) {
			throw new Error(`Translation key "${key}" not found for language "${lang}"`);
		}

		if (this.options.logging) {
			this.logger.warn(`Missing key: "${key}" in language: "${lang}"`);
		}

		return key;
	}
}
