import { ImAirplane } from 'react-icons/im';

import style from './style.module.scss';


export function Header() {
    return (
        <header className={style.headerContainer}>
        
        <div className={style.logo}><ImAirplane/><p>Trip Tips</p></div>
        </header>
    )
}