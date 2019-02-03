import { configure, addDecorator } from '@storybook/react';
import { withOptions } from '@storybook/addon-options';
import { withInfo } from '@storybook/addon-info';
import { withNotes } from '@storybook/addon-notes';
import { withKnobs } from '@storybook/addon-knobs';
import { QrcodeDecorator } from './addon-qrcode';

// https://github.com/storybooks/storybook/tree/v4.0.0-alpha.23/addons/options
withOptions({
  addonPanelInRight: false
});

// https://github.com/storybooks/storybook/tree/v4.0.0-alpha.23/addons/info
// addDecorator(withInfo({
//     // Params
//   }
// ));
addDecorator(withNotes);
addDecorator(withKnobs);
addDecorator(QrcodeDecorator);

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /.stories.tsx$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
