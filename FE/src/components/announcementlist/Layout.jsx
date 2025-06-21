import React from 'react';
import Header from './Header';
import AnnouncementSidebar from './Sidebar';
import styles from './Layout.module.css';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className={styles.layout}>
      <main className={styles.main}>
        <AnnouncementSidebar>
          <Header />
        </AnnouncementSidebar>
        <div className={styles.content}>
          <div className={styles.contentInner}>
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Layout;
