import { useRef, useState } from "react";
import { useUser } from "../contexts/userContext";
import { SocketEventsEnum } from "./constants";

export const useSocket = () => {
  const [{ user }] = useUser();
  const ws = useRef(null);
  const connectionId = useRef(null);  
	const subscribers = useRef([]);
	const [status, setStatus] = useState(null);

  const connect = () => {
    ws.current = new WebSocket(`ws://localhost:5000?token=${user.accessToken}`);

    ws.current.onopen = () => {
			console.log(ws.current.readyState );
      ws.current.send(JSON.stringify({ type: SocketEventsEnum.CONNECT }));
    };

    ws.current.onclose = () => {
			connectionId.current = null;
			setStatus(null);
    };

    ws.current.onmessage = (event) => {
      const result = JSON.parse(event.data);
			subscribers.current.forEach(s => {
				s(result);
			});
      switch (result.type) {
        case SocketEventsEnum.NEW_GAME:
          connectionId.current = result.connectionId;
          break;
        case SocketEventsEnum.START_GAME:
					setStatus('STARTED');
          connectionId.current = result.connectionId;
          break;
				case SocketEventsEnum.GAME_OVER:
						ws.current.close();
						break;
        default:
          console.log("Unknown");
      }
    };

    ws.current.onerror = (error) => {
      console.log(error);
    };
  };

  const close = () => {
    ws.current.close();
  };

  const send = (data) => {
    ws.current.send(JSON.stringify({ ...data, connectionId: connectionId.current }));
  };

	const subscribe = (callback) => {
		subscribers.current = [...subscribers.current, callback];
	};

	const unsubscribe = (callback) => {
		subscribers.current = subscribers.current.filter(c => c !== callback);
	};

  return { socket: ws.current, status, connect, close, send, subscribe, unsubscribe };
};
