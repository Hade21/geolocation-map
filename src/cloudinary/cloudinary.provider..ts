import { ConfigOptions, v2 } from 'cloudinary';
import { CLOUDINARY } from './constants';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: (): ConfigOptions => {
    return v2.config({
      cloud_name: 'dzvkgfdks',
      api_key: '745628368145314',
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  },
};
