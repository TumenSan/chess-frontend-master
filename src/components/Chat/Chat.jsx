import { useContext, useEffect, useState } from "react";
import { SocketEventsEnum } from "../../connection/constants";
import { SocketContext } from "../../contexts/socketContext";
import { useUser } from "../../contexts/userContext";
import styles from "./chat.module.css";

export const Chat = ({ visible, close }) => {
  const [{ user }] = useUser();
  const socketData = useContext(SocketContext);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
		const processMessage = (result) => {
			if (result.type === SocketEventsEnum.CHAT) {
				setMessages((m) => [...m, result]);
			}
		};
    socketData.subscribe(processMessage);

    return () => {      
      socketData.unsubscribe(processMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = (event) => {
    if (event.keyCode === 13) {
			const message = event.target.value;
      setMessages((m) => [
        ...m,
        { userId: user.id, message },
      ]);
      socketData.send({
        type: SocketEventsEnum.CHAT,
        message,
      });
			event.target.value = '';
      console.log(event, event.target.value);
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <div className={styles.chatWrapper}>
      <div className={styles.chatHeader}>
        <span>Чат</span>
        <div className={styles.chatCloseButton} onClick={close} />
      </div>
      <div className={styles.chatMessages}>
        {messages.map((data) => (
          <div
            className={`${styles.chatMessage} ${
              data.userId === user.id ? styles.myChatMessage : ""
            }`}
          >
            {data.message}
            {data.userId === user.id && (
              <span className={styles.youTitle}>Вы</span>
            )}
          </div>
        ))}
      </div>
      <div className={styles.chatInput}>
        <input
          type="text"
          onKeyUp={sendMessage}
          placeholder="Введите сообщение"
        />
      </div>
    </div>
  );
};
