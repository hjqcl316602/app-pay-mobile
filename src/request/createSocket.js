/**
 * 创建socket
 */

import configs from '../config';
let Stomp = require('stompjs');

let SockJS = require('sockjs-client');

console.log(Stomp);

export default function(url = '/chat/socket/chat-webSocket') {
  let stompClient = null;

  let http = configs['HTTP_REQUEST_BASIC'] + url;

  let socket = new SockJS(http);

  stompClient = Stomp.over(socket);

  stompClient.debug = false;

  return stompClient;
}

export { Stomp, SockJS };

// stompClient.connect({}, function (frame) {
//   stompClient.subscribe("/user/" + self.msg.myId + "/" + self.orderId,
//     function (response) {
//     }
//   );
// });
