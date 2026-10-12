






function aa<List extends unknown[]>(...list: List): { [K in keyof List]: List[K] } {
  return list;
}
const a = aa(1, 's', 2)






import maybe from './utils/maybe.js';
const map: Map<number, number> = new Map();
maybe('')?.value

const maybeVal = maybe(map.get(1))?.map(val => val * 100)?.value;
if (maybeVal != null) {
  console.log(maybeVal);
}

maybe(map.get(4))
  ?.map(val => val > 0? val : undefined)
  ?.tap(val => {
    console.log(val);
  }) ?? (() => {
    console.log('어딘가 잘못됨!');
  })();



// 스크린.on마우스다운(주버튼, ({ 좌표 }) => {
//   const 인덱스 = 지도모델.calc인덱스from좌표(좌표);
//   if (인덱스 != null) {
//     const 선택유닛키들 = maybe(선택.get인덱스())
//       .map(지도모델.get유닛키들from인덱스)
//       .value;
//     if (선택유닛키들) {

//     } else {

//     }
//   } else {

//   }
// });



new Worker(
  new URL('../../aaa/eeeee.js', import.meta.url),
  {
    name: 'worker name',
    type: 'module'
  }
);



import WebSocketManager, { createWebSocketManager } from './_web-socket/web-socket-manager.js';

createWebSocketManager



const map2 = new Map([[1, 'str']]);

const val2 = [5]
  .filter(val => val != null)
  .filter(val => val > 0)
  .map(val => map2.get(val)).filter(val => val != null)
  .map(val => {
    if (val == null) console.log('err')
    return val;
  })
  .map(val => val.length)
  .pop();

val2;