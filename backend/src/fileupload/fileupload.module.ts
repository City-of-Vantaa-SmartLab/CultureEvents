import { Module } from '@nestjs/common';
import { FileUploadController } from './fileupload.controller';
import { FileUploadService } from './fileupload.service';
import { EventsModule } from 'event/events.module';
import { EventsService } from 'event/events.service';

@Module({
  controllers: [FileUploadController],
  providers: [FileUploadService],
  exports: [FileUploadService],
})
export class FileUploadModule {}
