import { Controller, Get, Query } from '@nestjs/common';
import { IQueryString } from './types/products.interface';

@Controller('products')
export class ProductsController {
  @Get()
  productList(@Query() queryString?: IQueryString) {
    return `GET category: ${queryString.category} productList.`;
  }
}
