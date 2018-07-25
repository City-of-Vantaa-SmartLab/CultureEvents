import {
  Controller,
  Post,
  Req,
  UsePipes,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FileUploadService } from './fileupload.service';
import { ValidationPipe } from 'validations/validation.pipe';
import { ValidationService } from '../utils/validations/validations.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiUseTags, ApiImplicitParam, ApiResponse } from '@nestjs/swagger';

@ApiUseTags('fileupload')
@Controller('/api/fileupload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}
  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiImplicitParam({
    name: 'upload',
    description: 'file to be uploaded',
    required: true,
    type: 'File',
  })
  @ApiResponse({
    status: 201,
    description: 'Return the url of the file which was uploaded!',
  })
  @ApiResponse({ status: 401, description: 'Failed to upload image file!' })
  @ApiResponse({
    status: 500,
    description: 'Failed to upload image file due to system error!',
  })
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
