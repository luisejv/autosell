import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err))
  .finally(() => {
    window.console = {
      ...window.console,
      log: function () {},
      warn: function () {},
      error: function () {},
      group: function () {},
      groupEnd: function () {},
      dir: function () {},
    };
  });
