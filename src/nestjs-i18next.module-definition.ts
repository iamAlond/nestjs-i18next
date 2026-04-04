import { ConfigurableModuleBuilder } from '@nestjs/common';
import { I18nextModuleOptions } from './nestjs-i18next';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
	new ConfigurableModuleBuilder<I18nextModuleOptions>()
		.setClassMethodName('forRoot')
		.setFactoryMethodName('createLibraryOptions')
		.setExtras({ isGlobal: true }, (definition, extras) => ({
			...definition,
			global: extras.isGlobal
		}))
		.build();
