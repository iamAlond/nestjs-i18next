export type I18nextModuleOptions = {
	fallbackLanguage: string;
	loadingOptions: {
		path: string;
		enableSubfolders?: boolean;
		watch?: boolean;
	};
	logging?: boolean;
	throwOnMissingKey?: boolean;
	generatedTypesPath?: string;
};

export type TranslateOptions<P, T> = {
	lang?: string;
	defaultValue?: string;
	debug?: boolean;
} & (Extract<T, { key: P }> extends { args: infer A } ? { args: A } : { args?: never });

export type PathImpl<T, K extends keyof T> = K extends string
	? T[K] extends Record<string, any>
		? T[K] extends ArrayLike<any>
			? K | `${K}.${PathImpl<T[K], Exclude<keyof T[K], keyof any[]>>}`
			: K | `${K}.${PathImpl<T[K], keyof T[K]>}`
		: K
	: never;

export type Path<T> = T extends string
	? never
	: {
			[K in keyof T]: T[K] extends { _str: string }
				? `${K & string}`
				: T[K] extends Record<string, any>
					? `${K & string}` | `${K & string}.${Path<T[K]>}`
					: `${K & string}`;
		}[keyof T];

export type PathValue<T, P extends string> = P extends `${infer Key}.${infer Rest}`
	? Key extends keyof T
		? PathValue<T[Key], Rest>
		: never
	: P extends keyof T
		? T[P]
		: never;

export type ExtractArgs<T> = T extends { _args: infer A }
	? keyof A extends never
		? never
		: A
	: never;
