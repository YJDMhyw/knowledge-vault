import { NavLink, useLocation } from 'react-router-dom';
import { Home, FolderTree, GraduationCap, Settings } from 'lucide-react';
import styles from './MobileNav.module.css';

const navItems = [
  { path: '/', icon: Home, label: '主页' },
  { path: '/categories', icon: FolderTree, label: '目录' },
  { path: '/quiz', icon: GraduationCap, label: '考核' },
  { path: '/manage', icon: Settings, label: '管理' }
];

export default function MobileNav() {
  const location = useLocation();

  return (
    <nav className={styles.mobileNav}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={`${styles.navItem} ${isActive ? styles.active : ''}`}
          >
            <Icon size={20} className={styles.navIcon} />
            <span className={styles.navLabel}>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
