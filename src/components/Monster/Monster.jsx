import React from 'react';
import style from './Monster.module.css';

export class Monster extends React.Component {
    render() {
        return (
            <div className={style.ufo}>
                <div className={style.monster}>
                    <div className={style.body}>
                        <div className={style.ear}></div>
                        <div className={style.ear}></div>
                        <div className={style.vampimouth}>
                            <div className={style.vampitooth}></div>
                        </div>
                    </div>
                    <div className={style.eyelid}>
                        <div className={style.eyes}>
                            <div className={style.eye}></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Monster;