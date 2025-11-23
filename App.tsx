

import React, { useState, useEffect } from 'react';
import { Globe, Moon, Sun } from 'lucide-react';
import { WikiArticle, ViewMode, INITIAL_TREE_DATA, NavNode } from './types';
import { Sidebar, TopBar } from './components/TopNavigation';
import ArticleView from './components/ArticleView';
import Editor from './components/Editor';
import TreeEditor from './components/TreeEditor';
import ThemeSelector from './components/ThemeSelector';

// Helper to generate a blank template for new pages
const createTemplate = (title: string): string => "";

const createTableTemplate = () => {
  return `
    <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 mb-6 bg-white dark:bg-slate-900 shadow-sm">
      <table class="w-full text-sm text-right border-collapse">
        <thead>
          <tr class="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
            <th class="p-3 font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap sticky right-0 z-20 bg-slate-50 dark:bg-slate-900/50 border-l border-slate-200 dark:border-slate-700">عنوان ستون ۱</th>
            <th class="p-3 font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">عنوان ستون ۲</th>
            <th class="p-3 font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">عنوان ستون ۳</th>
            <th class="p-3 font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">عنوان ستون ۴</th>
          </tr>
        </thead>
        <tbody>
          ${Array(5).fill(0).map((_, i) => `
            <tr class="border-b border-slate-100 dark:border-slate-800 last:border-0 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${i % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/50 dark:bg-slate-900/50'}">
              <td class="p-3 text-slate-700 dark:text-slate-300 whitespace-nowrap sticky right-0 z-10 border-l border-slate-200 dark:border-slate-700 font-bold ${i % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/50 dark:bg-slate-900/50'}">داده ردیف ${i+1} ستون ۱</td>
              <td class="p-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">داده ردیف ${i+1} ستون ۲</td>
              <td class="p-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">داده ردیف ${i+1} ستون ۳</td>
              <td class="p-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">داده ردیف ${i+1} ستون ۴</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
};

// Initial Articles Database
const INITIAL_ARTICLES: Record<string, WikiArticle> = {
  "صفحه اصلی": {
    title: 'صفحه اصلی',
    category: 'عمومی',
    lastEdited: '۱۴۰۳/۰۸/۰۱',
    contentHtml: '' // Handled by HomeDashboard Component
  },
  "همکاران سابق": {
    title: 'همکاران سابق',
    category: 'سرمایه انسانی',
    lastEdited: 'جدید',
    contentHtml: createTableTemplate()
  },
  "همکاران فعال": {
    title: 'همکاران فعال',
    category: 'سرمایه انسانی',
    lastEdited: 'جدید',
    contentHtml: createTableTemplate()
  },
  "عملکرد": {
    title: 'عملکرد',
    category: 'عملکرد',
    lastEdited: '۱۴۰۳/۰۸/۰۵',
    contentHtml: '' // Handled by Component
  }
};

// Helper to find node info including parent
interface NodeInfo {
  node: NavNode;
  parent: NavNode | null;
  level: number;
}

const findNodeInfo = (nodes: NavNode[], label: string, level = 0, parent: NavNode | null = null): NodeInfo | null => {
  for (const node of nodes) {
    if (node.label === label) return { node, parent, level };
    if (node.children) {
      const found = findNodeInfo(node.children, label, level + 1, node);
      if (found) return found;
    }
  }
  return null;
};

const App: React.FC = () => {
  const [treeData, setTreeData] = useState<NavNode[]>(INITIAL_TREE_DATA);
  const [articles, setArticles] = useState<Record<string, WikiArticle>>(INITIAL_ARTICLES);
  const [currentTopic, setCurrentTopic] = useState<string>("صفحه اصلی");
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.READ);
  const [isTreeEditorOpen, setIsTreeEditorOpen] = useState(false);
  const [activeAccordionId, setActiveAccordionId] = useState<string | null>(null);
  const [isSidebarPinned, setIsSidebarPinned] = useState(true); // Default pinned on desktop
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Dark Mode State
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('theme_mode') === 'dark' || 
               (!localStorage.getItem('theme_mode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme_mode', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme_mode', 'light');
    }
  }, [darkMode]);

  // Get current article or template
  const currentArticle = articles[currentTopic] || {
    title: currentTopic,
    category: 'نامشخص',
    lastEdited: 'جدید',
    contentHtml: createTemplate(currentTopic),
    isTemplate: true
  };

  // Logic to get sub-articles for Accordion View
  const nodeInfo = currentTopic !== "صفحه اصلی" ? findNodeInfo(treeData, currentTopic) : null;
  const currentNode = nodeInfo?.node;
  
  // Show children as accordions if the current node has children.
  const subArticlesData = (currentNode?.children && currentNode.children.length > 0)
    ? currentNode.children.map(child => ({
        id: child.id,
        title: child.label,
        contentHtml: articles[child.label]?.contentHtml || createTemplate(child.label)
      }))
    : undefined;

  const handleTopicSelect = (topic: string) => {
    // Standard Page Navigation Pattern
    // Every topic, regardless of tree depth, is treated as a standalone page.
    setCurrentTopic(topic);
    setActiveAccordionId(null); 
    setViewMode(ViewMode.READ);
    setIsMobileMenuOpen(false);
  };

  const handleSaveEdit = (newContent: string) => {
    setArticles(prev => ({
      ...prev,
      [currentTopic]: {
        title: currentTopic,
        category: prev[currentTopic]?.category || 'مستندات',
        lastEdited: new Date().toLocaleDateString('fa-IR'),
        contentHtml: newContent,
        isTemplate: false
      }
    }));

    // Stay on the current page after saving
    setViewMode(ViewMode.READ);
  };

  const handleUpdateTree = (newData: NavNode[]) => {
    setTreeData(newData);
    setIsTreeEditorOpen(false);
  };

  const handleEditSubArticle = (title: string) => {
    setCurrentTopic(title);
    setViewMode(ViewMode.EDIT);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-950 font-[Vazirmatn] transition-colors duration-300">
      
      {/* Glassmorphism Header (Fixed Height) */}
      <header className="h-16 shrink-0 w-full border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md transition-colors duration-300 z-50">
        <div className="max-w-[1920px] mx-auto px-4 h-full flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleTopicSelect("صفحه اصلی")}>
            <div className="w-10 h-10 bg-gradient-to-tr from-primary-600 to-primary-400 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform duration-300">
              <Globe size={20} className="text-white" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">دانشنامه دارالشفاء</h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">مستندات جامع سازمانی</p>
            </div>
          </div>

          <div className="flex-1"></div>

          {/* User Tools */}
          <div className="flex items-center gap-2">
             {/* Theme Selector */}
             <ThemeSelector />

             <button 
               onClick={() => setDarkMode(!darkMode)}
               className="p-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
               title={darkMode ? "حالت روز" : "حالت شب"}
             >
               {darkMode ? <Sun size={20} /> : <Moon size={20} />}
             </button>
             
          </div>
        </div>
      </header>

      {/* Main Flex Container (Sidebar + Content) */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Sidebar */}
        <Sidebar 
          treeData={treeData} 
          onSelectTopic={handleTopicSelect} 
          currentTopic={currentTopic}
          isPinned={isSidebarPinned}
          onTogglePin={() => setIsSidebarPinned(!isSidebarPinned)}
          isMobileMenuOpen={isMobileMenuOpen}
          onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content Column */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950 transition-all duration-300">
            
            {/* Breadcrumbs / Top Bar */}
            <TopBar 
              currentTopic={currentTopic}
              isPinned={isSidebarPinned}
              onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
            />

            {/* Scrollable Content Area */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar scroll-smooth">
               <div className="max-w-[1920px] mx-auto min-h-full flex flex-col">
                  <div className="max-w-7xl mx-auto w-full flex-1">
                      {viewMode === ViewMode.READ ? (
                          <ArticleView 
                            article={currentArticle} 
                            onEdit={() => setViewMode(ViewMode.EDIT)} 
                            subArticles={subArticlesData}
                            onEditSubArticle={handleEditSubArticle}
                            activeSectionId={activeAccordionId}
                            onNavigate={handleTopicSelect}
                          />
                      ) : (
                          <Editor 
                            article={currentArticle} 
                            onSave={handleSaveEdit} 
                            onCancel={() => setViewMode(ViewMode.READ)} 
                          />
                      )}
                  </div>

                  {/* Footer */}
                  <footer className="mt-auto pt-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                    <p>© ۱۴۰۳ دانشنامه دارالشفاء کوثر. تمامی حقوق محفوظ است.</p>
                    <div className="flex justify-center gap-4 mt-4">
                      <button className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">تماس با ما</button>
                      <button className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">حریم خصوصی</button>
                    </div>
                  </footer>
               </div>
            </main>
        </div>
      </div>

      {/* Tree Editor Modal */}
      {isTreeEditorOpen && (
        <TreeEditor 
          initialData={treeData} 
          onSave={handleUpdateTree} 
          onClose={() => setIsTreeEditorOpen(false)} 
        />
      )}
    </div>
  );
};

export default App;