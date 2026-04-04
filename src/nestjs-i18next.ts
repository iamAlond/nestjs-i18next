export type I18nextModuleOptions = {
	fallbackLanguage: string;
	loadingOptions: {
		path: string;
		subfolders?: boolean;
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
