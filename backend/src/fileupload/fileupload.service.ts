import { Req, Res, Injectable } from '@nestjs/common';
import * as multer from 'multer';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';
import { EventsService } from 'event/events.service';

const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'vantaa';
const s3 = new AWS.S3();
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

@Injectable()
export class FileUploadService {
  constructor() {}

  async fileupload(@Req() req, @Res() res) {
    this.upload(req, res, function(error) {
      if (error) {
        return res.status(404).send(`Failed to upload image file: ${error}`);
      }
      return res.status(201).send(req.files[0].location);
    });
  }

  upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: AWS_S3_BUCKET_NAME,
      acl: 'public-read',
      key: function(request, file, cb) {
        cb(null, `${Date.now().toString()} - ${file.originalname}`);
      },
    }),
  }).array('upload', 1);
}
