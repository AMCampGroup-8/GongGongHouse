import React from 'react';
import logo from '../../../public/images/header_logo.png';
import styles from './Header.module.css';

function Header() {
  return (
    <header>
      <div className="flex items-center h-full px-6">
        <a href="/" className="flex items-center">
          <div className="h-25">
            <img src={logo} alt="MyHomeGo" className={styles.logoImg} />
          </div>
        </a>
      </div>
    </header>
  );
}

export default Header;
