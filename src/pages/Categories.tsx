import { useState } from 'react';
import TopLevelPage from './TopLevelPage';
import SubLevelPage from './SubLevelPage';
import ConceptsPage from './ConceptsPage';
import { useAppStore } from '../context/AppContext';

type NavigationState =
  | { level: 'top' }
  | { level: 'sub'; topCategoryId: string }
  | { level: 'concepts'; topCategoryId: string; subCategoryId: string };

export default function Categories() {
  const [navigation, setNavigation] = useState<NavigationState>({ level: 'top' });
  const { categories } = useAppStore();

  const handleNavigateToSubLevel = (topCategoryId: string) => {
    setNavigation({ level: 'sub', topCategoryId });
  };

  const handleNavigateToConcepts = (subCategoryId: string) => {
    if (navigation.level === 'sub') {
      setNavigation({
        level: 'concepts',
        topCategoryId: navigation.topCategoryId,
        subCategoryId,
      });
    }
  };

  const handleNavigateBack = () => {
    if (navigation.level === 'concepts') {
      setNavigation({ level: 'sub', topCategoryId: navigation.topCategoryId });
    } else if (navigation.level === 'sub') {
      setNavigation({ level: 'top' });
    }
  };

  const getPathLabels = () => {
    if (navigation.level === 'concepts') {
      const topCategory = categories.find(c => c.id === navigation.topCategoryId);
      const subCategory = categories.find(c => c.id === navigation.subCategoryId);
      return [
        { label: topCategory?.name || '', onClick: () => setNavigation({ level: 'top' }) },
        { label: subCategory?.name || '', onClick: () => setNavigation({ level: 'sub', topCategoryId: navigation.topCategoryId }) }
      ];
    }
    if (navigation.level === 'sub') {
      const topCategory = categories.find(c => c.id === navigation.topCategoryId);
      return [
        { label: topCategory?.name || '', onClick: () => setNavigation({ level: 'top' }) }
      ];
    }
    return [];
  };

  return (
    <div className="categories-page">
      <div className="breadcrumb">
        <span className="breadcrumb-home" onClick={() => setNavigation({ level: 'top' })}>
          知识目录
        </span>
        {getPathLabels().map((item, index) => (
          <span key={index} className="breadcrumb-item">
            <span className="breadcrumb-arrow">→</span>
            <span onClick={item.onClick}>{item.label}</span>
          </span>
        ))}
      </div>

      {navigation.level === 'top' && (
        <TopLevelPage onNavigateToSubLevel={handleNavigateToSubLevel} />
      )}

      {navigation.level === 'sub' && (
        <SubLevelPage
          topCategoryId={navigation.topCategoryId}
          onNavigateBack={handleNavigateBack}
          onNavigateToConcepts={handleNavigateToConcepts}
        />
      )}

      {navigation.level === 'concepts' && (
        <ConceptsPage
          subCategoryId={navigation.subCategoryId}
          onNavigateBack={handleNavigateBack}
        />
      )}
    </div>
  );
}