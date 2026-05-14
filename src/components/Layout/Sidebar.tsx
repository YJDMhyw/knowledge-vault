import { NavLink, useLocation } from 'react-router-dom';
import { Home, FolderTree, GraduationCap, Settings, BookMarked } from 'lucide-react';
import styles from './Sidebar.module.css';

const navItems = [
  { path: '/', icon: Home, label: '主界面', description: '学习概览' },
  { path: '/categories', icon: FolderTree, label: '知识目录', description: '浏览分类' },
  { path: '/quiz', icon: GraduationCap, label: '考核测试', description: '检验成果' },
  { path: '/manage', icon: Settings, label: '管理设置', description: '数据管理' }
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoSection}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <BookMarked size={28} />
          </div>
          <div className={styles.logoText}>
            <span className={styles.logoTitle}>知识宝库</span>
            <span className={styles.logoSubtitle}>Knowledge Vault</span>
          </div>
        </div>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className={styles.navIconWrapper}>
                <Icon size={20} className={styles.navIcon} />
              </div>
              <div className={styles.navContent}>
                <span className={styles.navLabel}>{item.label}</span>
                <span className={styles.navDesc}>{item.description}</span>
              </div>
              {isActive && (
                <div className={styles.activeIndicator}>
                  <div className={styles.activeDot} />
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <div className={styles.version}>v1.0.0</div>
        <div className={styles.copyright}>© 2024 Knowledge Vault</div>
      </div>
    </aside>
  );
}