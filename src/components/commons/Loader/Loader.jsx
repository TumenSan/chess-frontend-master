import styles from './loader.module.css';

export const Loader = () => {
    console.log(styles.loader)
    return <div className={styles.loaderWrapper}><div className={styles.loader} /></div>
};