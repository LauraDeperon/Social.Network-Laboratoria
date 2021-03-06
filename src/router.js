/* eslint-disable arrow-parens */
/* eslint-disable max-len */
import { Login } from './pages/login/index.js';
import { Register } from './pages/register/index.js';
import { Profile } from './pages/profile/index.js';
import { Timeline } from './pages/timeline/index.js';
import { onNavigate } from './utils/history.js';
import { verifyUser, InfoProfileEmail, UserProfileInfo } from './services/index.js';

const routeRender = () => {
  const rootDiv = document.getElementById('root');
  const routes = {
    '/': Login,
    '/register': Register,
    '/profile': Profile,
    '/timeline': Timeline,
  };

  rootDiv.innerHTML = '';
  rootDiv.appendChild(routes[window.location.pathname]());
};

window.addEventListener('popstate', routeRender);

window.addEventListener('load', () => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      verifyUser()
        .then((result) => {
          if (result.size < 1) {
            InfoProfileEmail();
            onNavigate('/profile');
          }
        });

      UserProfileInfo(user.id)
        .then(doc => {
          const data = doc.data();
          if (data.name === null || data.username === null || data.bio === null || data.favGenres === null) {
            onNavigate('/profile');
          } else {
            onNavigate('/timeline');
          }
        });
    } else {
      onNavigate('/');
    }
  });
});
