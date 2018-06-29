import { Injectable } from '@nestjs/common';
@Injectable()
export class ValidationService {
  validateId(id: number) {
    if (typeof id !== 'number' || isNaN(id)) {
      return 'Id is not valid';
    }
  }
}
