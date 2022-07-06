import style from './Home.module.scss';
import Header from '../Header/Header';
import Shelf from '../Shelf/Shelf';
import { useEffect, useRef } from 'react';

export default function Home() {
  
  const container = useRef();

  return (
    <>
        <main className={style.main} ref={container}>
            <Header/>
            <header className={style.header}>
              <div>
                  <h2>Stripe Press</h2>
                  <h3>Ideas for progress</h3>
              </div>
            </header>
            <Shelf scrollContainer={container}/>
        </main>
    </>
  )
}
