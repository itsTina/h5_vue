import Cookies from 'js-cookie';

export function setSid(sid) {
  Cookies.set('sid', sid);
}

export function getSid() {
  return Cookies.get('sid');
}
