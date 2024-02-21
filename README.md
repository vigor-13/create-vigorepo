# create-vigorepo

이 CLI는 레포지토리 템플릿을 간편하게 설치할 수 있도록 도와준다. [`create-turbo`](https://www.npmjs.com/package/create-turbo) 에서 영감을 받았다.

## 사용법

다음의 명령어를 사용하여 레포지토리 템플릿을 설치할 수 있다.

```bash
npx create-vigorepo@latest
```

## 옵션

- `-t <template-name>`: 설치할 템플릿을 지정한다.

```bash
npx create-vigorepo@latest -t monorepo
```

사용 가능한 템플릿은 다음과 같다.

| 템플릿               | 설명            |
| -------------------- | --------------- |
| `polyrepo` (default) | 일반 레포지토리 |
| `monorepo`           | 모노레포        |

자세한 내용은 [깃헙 레포지토리](https://github.com/vigor-13/create-vigorepo/tree/main/templates)를 확인한다.
