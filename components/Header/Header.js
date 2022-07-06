import style from './Header.module.scss';
import logo from '../../public/images/logo.png'
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <>
        <Link href={'/'}>
          <a>
            <div className={style.logo}>
              <Image src={logo} width={35} height={50} />
            </div>
          </a>
        </Link>        
    </>
    
  )
}
