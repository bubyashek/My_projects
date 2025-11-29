import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          background: '#f5f7fa',
          surface: '#ffffff',
          primary: '#5a67d8',
          secondary: '#48bb78',
          error: '#e53e3e',
          success: '#48bb78',
          warning: '#ecc94b',
          info: '#38b2ac',
        },
      },
    },
  },
  defaults: {
    VCard: {
      elevation: 1,
    },
    VBtn: {
      elevation: 0,
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
    },
  },
});
