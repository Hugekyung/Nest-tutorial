import { Controller, Get, Param, Query } from '@nestjs/common';
import { IQueryString } from './types/products.interface';

@Controller('products')
export class ProductsController {
  @Get()
  productList(@Query() queryString?: IQueryString) {
    return `GET category: ${queryString.category} productList.`;
  }

  @Get(':pid')
  getProduct(@Param('pid') pid: string) {
    return `GET Product Details that productId: ${pid}`;
  }
}
