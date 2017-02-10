import Teams from '../modules/Teams';
import Companies from '../modules/Companies';
import Feedback from '../modules/Feedback';
import Preferences from '../modules/Preferences';
import Logout from '../modules/Logout';

import TeamIcon from 'material-ui/svg-icons/social/people';
import CompanyIcon from 'material-ui/svg-icons/action/work';
import FeedbackIcon from 'material-ui/svg-icons/action/feedback';
import PreferencesIcon from 'material-ui/svg-icons/action/settings';
import LogoutIcon from 'material-ui/svg-icons/action/exit-to-app';

// First route is the index route
export default [{
  path: '/teams',
  name: 'Teams',
  component: Teams,
  icon: TeamIcon,
}, {
  path: '/companies',
  name: 'Companies',
  component: Companies,
  icon: CompanyIcon,
}, {
  path: '/feedback',
  name: 'Feedback',
  component: Feedback,
  icon: FeedbackIcon,
}, {
  path: '/preferences',
  name: 'Preferences',
  component: Preferences,
  icon: PreferencesIcon,
  separator: true,
}, {
  path: '/logout',
  name: 'Logout',
  component: Logout,
  icon: LogoutIcon,
}];
