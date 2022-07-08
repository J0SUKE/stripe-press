import React, { useEffect, useState,useMemo, useRef } from 'react'
import Books from '../components/Books/Books'
import { useRouter } from 'next/router'

export default function BooksPage() 
{
    const router = useRouter();
    const wrapperRef = useRef();

    const [booksList,setBookList] = useState([
        'get-together',
        'the-making-of-prince-of-persia',
        'stubborn-attachments',
        'the-art-of-doing-science-and-engineering'
    ])

    const [section,useSection] = useState(null);    

    // ce useEffect ne doit intervenir qu'une seule fois
    useEffect(()=>{
        if (router.query.title) 
        {
            const url = router.query.title.toLowerCase();
            if (booksList.includes(url)) 
            {                
                useSection(url);
            }
            else
            {
                useSection(booksList[0]);
            }
        }
    },[router])

    useEffect(()=>{
        if (section) {
            router.push(section,section,{scroll:false,shallow:true})    
        }        
    },[section])

    
    
    return (
        <Books useSection={useSection} wrapperRef={wrapperRef} booksList={booksList}/>    
    )
}
