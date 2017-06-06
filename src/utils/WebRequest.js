import getConfig from './config';

export function getUrl(path) {
  return getConfig().api_url+path
}

