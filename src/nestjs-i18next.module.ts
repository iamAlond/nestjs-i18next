import { Inject, Logger, Module, OnModuleInit } from '@nestjs/common';
import { I18nextModuleOptions } from './nestjs-i18next';
import { I18nextJsonLoader } from './nestjs-i18next.json-loader';
import { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } from './nestjs-i18next.module-definition';
import { I18nextService } from './nestjs-i18next.service';

@Module({
	providers: [I18nextService, I18nextJsonLoader],
	exports: [I18nextService]
})
export class I18nextModule extends ConfigurableModuleClass implements OnModuleInit {
	private readonly logger = new Logger(I18nextModule.name);

	@Inject(MODULE_OPTIONS_TOKEN)
	private readonly options: I18nextModuleOptions;

	public onModuleInit() {
		if (this.options.logging) {
			this.logger.log(
				`I18nextModule initialized with options: ${JSON.stringify(this.options)}`
			);
		}
	}
}
