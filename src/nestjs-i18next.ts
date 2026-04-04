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

type BaseOptions = {
	lang?: string;
	defaultValue?: string;
	debug?: boolean;
};

export type TranslateOptions<P, T> =
	Extract<T, { key: P }> extends { args: infer A }
		? BaseOptions & { args: A }
		: BaseOptions | undefined;
