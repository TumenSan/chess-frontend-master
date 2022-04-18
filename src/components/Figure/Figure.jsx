import styles from './figure.module.css';

export const Figure = ({ figure }) => {
    return (<div className={styles.figure}>{figure.icon}</div>)
};