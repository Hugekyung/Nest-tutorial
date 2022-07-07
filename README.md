# Nest-tutorial

- Nest 공식문서 튜토리얼을 보면서 Nest를 학습하는 레포입니다.

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
