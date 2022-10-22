# Nest-tutorial

- Nest 공식문서 튜토리얼을 보면서 Nest를 학습하는 레포입니다.
- Jest 기반 테스트 코드 작성을 함께 진행합니다.

### DTO

- DTO는 데이터가 네트워크를 통해 전송되는 방법을 정의하는 객체
- TypeScript 인터페이스를 사용하거나 간단한 클래스 를 사용하여 DTO 스키마 정의
- 공식문서에서는 인터페이스보다 클래스를 활용해 DTO 객체를 선언하는 것을 권장한다.<br/>

  > 클래스는 JavaScript ES6 표준의 일부이므로 컴파일된 JavaScript에서 실제 엔터티로 보존된다. 반면 TypeScript 인터페이스는 변환 중에 제거되기 때문에 Nest는 런타임에 이를 참조할 수 없다. 파이프와 같은 기능은 런타임에 변수의 메타 유형에 액세스할 수 있을 때 추가 가능성을 가능하게 하기 때문에 중요하다.

### 예외 필터

- Nest는 기본적으로 `HttpException`이라는 내장 클래스를 제공한다.
- 아래와 같이 사용하며, response인 error 객체는 응답값으로 message와 status를 갖는다.

```ts
throw new HttpException(
  {
    status: HttpStatus.FORBIDDEN,
    message: '일치하는 유저가 없습니다.',
  },
  HttpStatus.FORBIDDEN,
);

// Response
{
  "status": 403,
  "error": "This is a custom message"
}

```

### 유효성 검사

- class-validator와 class-transformer 라이브러리를 통해 간단하게 유효성검사를 수행할 수 있다.
- 아래와 같이 각 프로퍼티에 대한 데이터 정보를 정의해주면 해당 dto에 대한 유효성 검사를 수행하고 결과를 리턴한다.

```ts
export class UserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
```

### Pipes

- 파이프는 클라이언트의 요청에 따른 객체(Request-Data)를 router-handler로 가기 전 중간에서 유효성 검사, 데이터 형변환을 수행하는 역할을 한다.
- @nest/common 패키지에서 제공하는 내장 파이프가 있지만, 커스텀 파이프를 사용하려면 `class-validator`와 `class-transformer` 라이브러리를 설치해야 한다.
- 아래는 Nest에서 기본 제공하는 파이프

```
ValidationPipe
ParseIntPipe
ParseFloatPipe
ParseBoolPipe
ParseArrayPipe
ParseUUIDPipe
ParseEnumPipe
DefaultValuePipe
ParseFilePipe
```

- 일반적으로 Pipe 형식으로 적용하는데, 핸들러-레벨, 파라미터-레벨, 글로벌-레벨의 3가지 형태로 나뉜다.

```ts
// 핸들러-레벨
@Post()
@UsePipes(ValidationPipe)
createUser(@Body() createUserDto: UserDto): string {
  this.userService.createUser(createUserDto);
  return `Create New User! : ${createUserDto.username}`;
}

// 파라미터-레벨
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  return this.usersService.findOne(id);
}
```

- 만약 유효성 검사에 실패하게 될 경우 요청은 router-handler로 넘어가지 못하고 에러를 반환한다.

```JSON
{
    "statusCode": 400,
    "message": "Validation failed (numeric string is expected)",
    "error": "Bad Request"
}
```

<br/>

### Hot Reload

- webpack HMR(Hot-Module Replacement)을 통해 변경사항이 발생할 때마다 프로젝트를 컴파일 하는 방식 대신 빠르게 서버를 시작할 수 있게 도와준다.

### 유용한 커맨드

- Nest에서 제공하는 유용한 커맨드
- controller, service, module을 포함해 CRUD API를 개발하기 위한 기본적인 틀을 제공한다.

```bash
nest g res users
```

### Guard

- 권한을 부여하기 위한 미들웨어로서 모든 미들웨어가 동작한 뒤, 인터셉터나 파이프 이전에 실행한다.
- guard 기본 사용 예제

```js
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}

// 역할 기반 인증 예제
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return true;
  }
}
```

- 파이프나 인터셉트 등과 같이 Guard 역시 전역, 컨트롤러, 단일 핸들러 레벨에 각각 적용 가능하다.

```js
// 전역 레벨
const app = await NestFactory.create(AppModule);
app.useGlobalGuards(new RolesGuard());

// 컨트롤러 레벨
@Controller('cats')
@UseGuards(new RolesGuard())
export class CatsController {}

// 핸들러 레벨
@Post()
@SetMetadata('roles', ['admin'])
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}

```
