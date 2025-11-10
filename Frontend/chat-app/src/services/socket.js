import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let client = null;

export function createSocket(token) {
  if (client && client.connected) return client;
  client = new Client({
    webSocketFactory: () => new SockJS("/ws"),
    connectHeaders: { Authorization: `Bearer ${token}` },
    debug: () => {},
  });
  return client;
}

export function activateSocket({
  token,
  onConnect,
  onMessage,
  onPrivate,
  onPresence,
}) {
  const c = createSocket(token);
  c.onConnect = (frame) => {
    if (onConnect) onConnect(frame);
  };
  c.onStompError = (frame) => console.error("STOMP error", frame);
  c.activate();
  // helper subscriptions will be created by the caller using c.subscribe
  return c;
}

export function disconnectSocket() {
  if (client) {
    try {
      client.deactivate();
    } catch (e) {}
    client = null;
  }
}
