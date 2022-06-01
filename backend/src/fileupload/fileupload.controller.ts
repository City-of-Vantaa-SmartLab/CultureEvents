import {
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FileUploadService } from './fileupload.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('/api/fileupload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) { }
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Req() request, @Res() response) {
    try {
      await this.fileUploadService.fileupload(request, response);
    } catch (error) {
      return response
        .status(500)
        .json(`Failed to upload image file: ${error.message}`);
    }
  }
}
