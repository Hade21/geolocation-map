import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        { folder: 'profile-picture', resource_type: 'image' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      toStream(file.buffer).pipe(upload);
    });
  }

  async deleteImage(public_id: string) {
    return new Promise((resolve, reject) => {
      v2.uploader.destroy(public_id, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }
}
