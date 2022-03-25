# dviio

ES2018 以降をサポートする任意の環境で動作する DVI 操作ユーティリティ（現在製作中）

## Features

- [ ] DVI を YAML に変換する
  - [x] Node
  - [ ] ブラウザ
- [ ] YAML を DVI に変換する
- [ ] DVI を SVG に変換する

## Support

## Installing

## Example

```typescript
import { dviio } from "@dviio/base";
import { yaml } from "@dviio/node";

const toYaml = dviio(yaml);

(async () => {
  const handle = await open(dviPath, "r");
  console.log(await toYaml(handle, 1));
})();
```
