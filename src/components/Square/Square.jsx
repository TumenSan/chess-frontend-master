import styles from './square.module.css';



export const Square = ({ color, children, highlight, handleClick }) => {
    
    return (<div className={`${styles.square} ${styles[color]} ${highlight ? styles.highlight : ''}`} onClick={handleClick}>
        {children}
    </div>)
}