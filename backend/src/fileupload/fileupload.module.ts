import { Module } from '@nestjs/common';
import { FileUploadController } from './fileupload.controller';
import { FileUploadService } from './fileupload.service';

@Module({
  controllers: [FileUploadController],
  providers: [FileUploadService],
  exports: [FileUploadService],
})
export class FileUploadModule { }
