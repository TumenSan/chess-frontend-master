import { useState } from "react";
import { useUser } from "../../contexts/userContext";
import styles from "./promote.module.css";

export const PawnPromotion = ({ onClose }) => {
  const [, dispatch] = useUser();


  return (
    <div className={styles.signUp}>
      <p>
        <input
            type="radio"
            id="abuse"
            value="abuse"
            name="radioGroup"
        />
        <label htmlFor="abuse">Ферзь</label>
      </p>
      <p>
        <input
            type="radio"
            id="leaving"
            value="leaving"
            name="radioGroup"
        />
        <label htmlFor="leaving">Ладья</label>
      </p>
        <p>
            <input
                type="radio"
                id="leaving"
                value="leaving"
                name="radioGroup"
            />
            <label htmlFor="leaving">Конь</label>
        </p>
        <p>
            <input
                type="radio"
                id="leaving"
                value="leaving"
                name="radioGroup"
            />
            <label htmlFor="leaving">Слон</label>
        </p>
    </div>
  );
};
