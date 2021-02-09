import ColorPicker from '../pages/ColorPicker/index';
import Translator from '../pages/Translator/index';

const routeConfig = [
  {
    name: '颜色选择器',
    path: '/colorpicker',
    component: ColorPicker,
    icon: 'iconcolorSelector',
    icon_active: 'iconcolorSelector-copy',
  },
  {
    name: '翻译器',
    path: '/translator',
    component: Translator,
    icon: 'icontranslate',
    icon_active: 'icontranslate-copy',
  },
];

export default routeConfig;
