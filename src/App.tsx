import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import Categories from './pages/Categories';
import Quiz from './pages/Quiz';
import Manage from './pages/Manage';
import './styles/variables.css';
import './styles/animations.css';

export default function App() {
  return (
    <Router>
      <div style={{
        minHeight: '100vh',
        background: '#FAFAFA',
        padding: '20px',
        fontSize: '18px'
      }}>
        <h1 style={{ color: '#00B894', marginBottom: '20px' }}>测试页面</h1>
        <p style={{ color: '#2D3436', marginBottom: '10px' }}>如果你能看到这句话，说明渲染正常！</p>
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E8E8E8',
          borderRadius: '12px',
          padding: '20px',
          marginTop: '20px'
        }}>
          <h2 style={{ color: '#2D3436', marginBottom: '10px' }}>快速导航</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '10px' }}>
              <a href="/" style={{ color: '#00B894', textDecoration: 'none' }}>
                🏠 主界面
              </a>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <a href="/categories" style={{ color: '#00B894', textDecoration: 'none' }}>
                📁 知识目录
              </a>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <a href="/quiz" style={{ color: '#00B894', textDecoration: 'none' }}>
                🎓 考核测试
              </a>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <a href="/manage" style={{ color: '#00B894', textDecoration: 'none' }}>
                ⚙️ 管理设置
              </a>
            </li>
          </ul>
        </div>
      </div>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/manage" element={<Manage />} />
        </Routes>
      </Layout>
    </Router>
  );
}