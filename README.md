# UMMAK (움막)

움막은 JSON-SERVER 기반의 프로그래밍 연습을 위해 최대한 대충 만들 수 있는 API 입니다. ( 프론트엔드 개발자에게 유용 할 수 있습니다. )

## 시작하기

움막은 JSON을 데이터베이스로 사용합니다.

기본 값은 `db.json` 을 루트 디렉토리에 만드는 것입니다.

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

const PORT = 3000;
Ummak.init(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
```

TS ( index.ts )

```ts
import { Ummak } from 'ummak';

const PORT = 3000;
Ummak.init(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
```

이후에 파일 확장자에 맞는 컴파일을 실행하세요.

예시) `node index.js`
