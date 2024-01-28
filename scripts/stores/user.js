import { action, deepMap } from '../libs/vendor/nanostores/nanostores.js';

export const $user = deepMap({
  name: '',
  surname: '',
  groups: [],
  notifications: 0,
});

export const $readNotification = action($user, 'readNotification', (store) => {
  if (store.get().notifications <= 0) return;
  store.setKey('notifications', store.get().notifications - 1);
});
