import localeMessageBox from '@/components/message-box/locale/vi-VN';
import localeLogin from '@/views/login/locale/vi-VN';
import localeRegister from '@/views/register/locale/vi-VN';

import localeWorkplace from '@/views/dashboard/workplace/locale/vi-VN';


import localeSearchTable from '@/views/list/search-table/locale/vi-VN';
import localeCardList from '@/views/list/card/locale/vi-VN';

import localeStepForm from '@/views/form/step/locale/vi-VN';
import localeGroupForm from '@/views/form/group/locale/vi-VN';

import localeBasicProfile from '@/views/profile/basic/locale/vi-VN';

import localeDataAnalysis from '@/views/visualization/data-analysis/locale/vi-VN';
import localeMultiDAnalysis from '@/views/visualization/multi-dimension-data-analysis/locale/vi-VN';

import localeSuccess from '@/views/result/success/locale/vi-VN';
import localeError from '@/views/result/error/locale/vi-VN';

import locale403 from '@/views/exception/403/locale/vi-VN';
import locale404 from '@/views/exception/404/locale/vi-VN';
import locale500 from '@/views/exception/500/locale/vi-VN';

import localeUserInfo from '@/views/user/info/locale/vi-VN';
import localeUserSetting from '@/views/user/setting/locale/vi-VN';
/** simple end */
import localeSettings from './vi-VN/settings';

export default {
  'menu.dashboard': 'Bảng điều khiển',
  'menu.server.dashboard': 'Dashboard-Server',
  'menu.server.workplace': 'Workplace-Server',
  'menu.server.monitor': 'Monitor-Server',
  'menu.list': 'Quản lý đặt sân',
  'menu.products': 'Quản lý sản phẩm',
  'menu.result': 'Kết quả',
  'menu.exception': 'Ngoại lệ',
  'menu.form': 'Biểu mẫu',
  'menu.profile': 'Hồ sơ',
  'menu.visualization': 'Trực quan hóa dữ liệu',
  'menu.user': 'Quản lý người dùng',
  'menu.arcoWebsite': 'Arco Design',
  'menu.faq': 'FAQ',
  'navbar.docs': 'Docs',
  'navbar.action.locale': 'Chuyển sang tiếng Anh',
  ...localeSettings,
  ...localeMessageBox,
  ...localeLogin,
  ...localeRegister,
  ...localeWorkplace,
  /** simple */
  ...localeSearchTable,
  ...localeCardList,
  ...localeStepForm,
  ...localeGroupForm,
  ...localeBasicProfile,
  ...localeDataAnalysis,
  ...localeMultiDAnalysis,
  ...localeSuccess,
  ...localeError,
  ...locale403,
  ...locale404,
  ...locale500,
  ...localeUserInfo,
  ...localeUserSetting,
  /** simple end */
};
