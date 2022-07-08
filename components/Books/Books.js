import { forEach } from 'lodash';
import React, { useEffect, useMemo, useRef } from 'react'
import style from './Books.module.scss';
import {throttle} from 'lodash'

export default function Books({useSection,wrapperRef,booksList}) 
{
    const booksRef = useRef();    
    const lastVisible = useRef();

    useEffect(()=>{
        
        const observer = new IntersectionObserver((entries)=>{
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    useSection(entry.target.getAttribute('id'))
                    lastVisible.current = entry.target.getAttribute('id');
                }
                else
                {
                    useSection(lastVisible.current);
                }
            });
        },{
            threshold:0.9
        });

        [...booksRef.current.getElementsByClassName(style.section)].forEach(element=>{
            observer.observe(element);
        })        
        // wrapperRef.current.addEventListener('scroll',throttle(()=>{
        //     [...booksRef.current.getElementsByClassName(style.section)].forEach(element=>{
        //         const {clientHeight} = document.documentElement;
                
        //         if (element.getBoundingClientRect().top) {
                    
        //         }
        //     })        
        // },100))

    },[])

    return (
    <>
        <div className={style.main_wrapper} ref={wrapperRef}>
            <div className={style.books_container} ref={booksRef}>
                {
                    booksList.map(item=>(
                        <section key={item} id={item} className={style.section}>
                            <h1>{item}</h1>
                        </section>        
                    ))
                }                
            </div>            
        </div>
    </>        
    )
}
