import path from 'path';

export const NGINX = path.join(__dirname, '../../../nginx/nginx.exe');

export const PID_FILEPATH = path.join(__dirname, '../../../nginx/logs/nginx.pid');

export const SITES_ENABLED_DIR = path.join(__dirname, '../../../config/sites-enabled/');

export const NGINX_CONFIG_FILEPATH = path.join(__dirname, '../../../nginx/conf/nginx.conf');

export const NGINX_ROOT_DIR = path.join(__dirname, '../../../nginx/');
