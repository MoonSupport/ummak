# UMMAK (움막)

움막은 JSON-SERVER 기반의 프로그래밍 연습을 위해 최대한 대충 만들 수 있는 API 입니다. ( 프론트엔드 개발자에게 유용 할 수 있습니다. )

## 목차

- [설치하기](#설치하기)
- [시작하기](#시작하기)

  - [Query](#Query)
    - [List](#List)
    - [Filter](#Filter)
    - [Sort](#Sort)
    - [Pagination](#Pagination)
    - [Find](#Find)
  - [Mutation](#Mutation)
    - [Create](#Create)
    - [Update](#Update)
    - [Delete](#Delete)
  - [Authenticate](#Authenticate)
  - [CustomRoute](#CustomRoute)

- [API](#API)

## 설치하기

npm

```shell
npm i ummak
```

yarn

```
yarn add ummak
```

## 시작하기

움막은 JSON을 데이터베이스로 사용합니다.

기본적인 방법은 `db.json` 을 루트 디렉토리에 만드는 것입니다.

db.json

```json
{
  "todos": [
    {
      "id": 1,
      "content": "HTML",
      "completed": true
    },
    {
      "id": 2,
      "content": "CSS",
      "completed": false
    }
  ],
  "users": [
    {
      "id": 1,
      "name": "Lee",
      "role": "developer"
    }
  ]
}
```

이후에 실행할 파일에 다음 코드를 작성합니다.

JS ( index.js )

```js
const { Ummak } = require('ummak');
Ummak.init();
```

TS ( index.ts )

```ts
import { Ummak } from 'ummak';
Ummak.init();
```

이후에 파일 확장자에 맞는 컴파일을 실행하세요.

예시) `node index.js`

> 이제 서버를 사용할 준비가 되었습니다.

## Query

### List

리소스의 모든 List를 가져오기 위해서는 단지 리소스에 해당되는 path에 접근하면 됩니다.
예를 들어 모든 todo 리스트를 가져오고 싶다면 json db의 키로 이루어진 리소스에 접근합니다.

db.json

```json
{
  "todos": [
    {
      "id": 1,
      "content": "HTML",
      "completed": true,
      "view": 3,
      "author": {
        "id": 69
      }
    },
    {
      "id": 2,
      "content": "CSS",
      "completed": false,
      "view": 8,
      "author": {
        "id": 75
      }
    },
    {
      "id": 3,
      "content": "JS",
      "completed": true,
      "view": 2,
      "author": {
        "id": 81
      }
    }
  ]
}
```

```
GET /todos
```

### Filter

일부 List만 요청하기 위해서 QueryString을 이용하여 Filter를 사용할 수 있습니다.

`.`을 이용하면 객체의 프로퍼티에 필터를 할 수 있습니다.

```
GET /todos?id=1&id=2
GET /todos?completed=true
GET /todos?author.id=81
```

### Sort

`\_sort`와 `\_order`로 정렬된 List를 가져 올 수 있습니다. 이 때, `_order` 는 기본 값으로 `asc` 입니다.

```
GET /todos?\_sort=id&\_order=asc
```

여러 필드를 정렬 할 수도 있습니다.

```
GET /todos?\_sort=id,views&\_order=desc,asc
```

### Paginate

`_page` 와 `_limit`로 페이지네이션을 할 수 있습니다. `_limit`은 기본 값으로 `10`개 입니다.

GET /todos?\_page=1
GET /todos?\_page=2&\_limit=2

### Find

파라미터를 통해 ID에 해당하는 데이터에 접근 할 수 있습니다.

```
GET /todos/1 # ID가 1인 todos에 접근
```

## Mutation

Query와 달리 Mutation은 조금 더 많은 노력을 요구합니다.

### Create

특정 키에 해당 하는 데이터를 `post` 요청을 통해 추가할 수 있습니다. 이 때, `path`는 반드시 리소스 명과 동일해야 합니다.

index.js

```js
const { Ummak } = require('ummak');
const server = Ummak.init();
server.post('/todos');
```

추가 할 데이터는 body의 값을 바탕으로 저장 됩니다.

```js
payload = {
  id: 4,
  content: 'Lua',
  completed: false,
  view: 3,
};
```

아이디는 생략 할 수 있습니다.

```js
POST / todos;

payload = {
  content: 'Lua',
  completed: false,
  view: 3,
};
```

### Update

특정 키에 해당 하는 데이터를 `put` 요청을 통해 수정할 수 있습니다. 이 때, `path`는 반드시 리소스 명과 동일하고, `:id` 파라미터를 넘겨주어야 합니다.

index.js

```js
const { Ummak } = require('ummak');
const server = Ummak.init();
server.put('/todos/:id');
```

request

```js
PUT / todos / 3;
payload = {
  view: 8,
};
```

### Delete

특정 키에 해당 하는 데이터를 `delete` 요청을 통해 삭제할 수 있습니다. 이 때, `path`는 반드시 리소스 명과 동일하고, `:id` 파라미터를 넘겨주어야 합니다.

index.js

```js
const { Ummak } = require('ummak');
const server = Ummak.init();
server.delete('/todos/:id');
```

request

```
DELETE /todos/3
```

## Authenticate

움막은 JWT기반의 인증을 지원합니다. `db` 에서 로그인을 위한 유저 토큰명을 입력할 수 있습니다. 기본 값은 `users` 입니다.

```js
server.auth();
server.auth('users');
```

기본적으로 `POST /login` 을 통해 로그인합니다.
인증 정보를 확인하려면 `POST /auth` 를 이용합니다.
유저의 인증은 find와 동일하게 동작합니다. 때문에 payload는 어떤 컬럼 값이든 상관 없습니다.
예를 들어 일반적으로 `username`과 `password`를 활용 할 수 있습니다.

```
POST / login

payload = {
  username: 'ummak1234',
  password: '1234ummak!@',
};

POST / auth
```

## API

`Ummak.init(PORT: number = 3000, callback: ()=> void = , filename: string = 'db.json')`

```

import { Ummak } from 'ummak';
Ummak.init();

```
