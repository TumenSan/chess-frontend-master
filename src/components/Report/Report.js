import styles from "./report.module.css";

export const Report = ({ onClose, title, adminView = false }) => {
  const onSubmit = (event) => {
    event.preventDefault();

    // TODO API call
    // event.target?.elements?.radioGroup?.value

    onClose();
  };

  return (
    <div className={styles.report}>
      <h3>{title ?? "Сообщить о нарушениях"}</h3>
      <section>
        <form onSubmit={onSubmit}>
          {!adminView && (
            <>
              <p>
                <input
                  type="radio"
                  id="abuse"
                  value="abuse"
                  name="radioGroup"
                />
                <label for="abuse">Оскорбления в чате</label>
              </p>
              <p>
                <input
                  type="radio"
                  id="leaving"
                  value="leaving"
                  name="radioGroup"
                />
                <label for="leaving">Игрок покинул игру</label>
              </p>
              <p>
                <input
                  type="radio"
                  id="other"
                  value="other"
                  name="radioGroup"
                />
                <label for="other">Другое</label>
              </p>
              <label htmlFor="otherReason">
                <input
                  type="text"
                  id="otherReason"
                  name="otherReason"
                  placeholder="Укажите причину"
                />
              </label>
            </>
          )}
          {adminView && (
            <label htmlFor="otherReason">
              <input
                type="text"
                id="otherReason"
                name="otherReason"
                placeholder="Укажите причину"
              />
            </label>
          )}
          <input type="submit" value="Отправить" />
        </form>
      </section>
    </div>
  );
};
