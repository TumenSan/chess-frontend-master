import { useState } from "react";
import styles from "./actionPanel.module.css";
import GameState from "../../GameState";

export const AnalysisPanel = () => {
  GameState.isAnalysis = true;

  return (
    <div className={styles.actionPanel}>
      Анализ
      <p>ходы были неплохими</p>
      <p>а ход e4 был вообще отличный</p>

    </div>
  );
};
