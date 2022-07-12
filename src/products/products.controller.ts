import { Controller, Get, Query } from '@nestjs/common';

@Controller('products')
export class ProductsController {
  @Get()
  productList(@Query() queryString?: string) {
    console.log(queryString);
    return `GET ${queryString} productList.`;
  }
}
