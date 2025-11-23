
import React, { useState, useEffect } from 'react';
import { NavNode } from '../types';
import { 
  List, X, ChevronLeft, Book, FolderOpen, Hash, ChevronDown, 
  Eye, Ear, Smile, Brain, Heart, Bone, Stethoscope, Baby, Scissors, 
  Image as ImageIcon, Microscope, Pill, Siren, Activity, Layers,
  Banknote, Shield, Laptop, Bean, Briefcase, GraduationCap, BookOpen, Wrench,
  Plus, Minus, Pin, PanelRightClose, Settings
} from 'lucide-react';

interface SidebarProps {
  treeData: NavNode[];
  onSelectTopic: (topic: string) => void;
  currentTopic: string;
  isPinned: boolean;
  onTogglePin: () => void;
  isMobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
  onEditTree?: () => void;
}

interface TopBarProps {
  currentTopic: string;
  isPinned: boolean;
  onToggleMobileMenu: () => void;
}

// Configuration
const MAX_TREE_LEVEL = 4; 

// Helper to finding path to current topic
const findPath = (nodes: NavNode[], targetLabel: string): NavNode[] | null => {
  for (const node of nodes) {
    if (node.label === targetLabel) {
      return [node];
    }
    if (node.children) {
      const path = findPath(node.children, targetLabel);
      if (path) {
        return [node, ...path];
      }
    }
  }
  return null;
};

// Helper: Get Icon Component based on Label
const getIconComponent = (label: string) => {
  const t = label.toLowerCase();
  
  // Medical - Specialized
  if (t.includes('چشم')) return Eye;
  if (t.includes('گوش') || t.includes('حلق')) return Ear;
  if (t.includes('دندان')) return Smile;
  if (t.includes('مغز')) return Brain;
  if (t.includes('قلب')) return Heart;
  if (t.includes('ارتوپدی') || t.includes('طب فیزیکی')) return Bone;
  if (t.includes('زنان') || t.includes('زایمان')) return Baby;
  if (t.includes('جراحی') && t.includes('عمومی')) return Scissors;
  if (t.includes('جراحی') && t.includes('محدود')) return Scissors;
  if (t.includes('کلیه') || t.includes('مجاری')) return Bean; // Kidney
  if (t.includes('گوارش') || t.includes('داخلی')) return Stethoscope;
  
  // Medical - Paraclinical
  if (t.includes('آزمایشگاه')) return Microscope;
  if (t.includes('داروخانه')) return Pill;
  if (t.includes('تصویربرداری')) return ImageIcon;
  if (t.includes('اورژانس') || t.includes('عمومی')) return Siren;
  if (t.includes('فیزیوتراپی')) return Activity;
  
  // Admin & Support
  if (t.includes('مالی')) return Banknote;
  if (t.includes('حراست')) return Shield;
  if (t.includes('فناوری') || t.includes('it')) return Laptop;
  if (t.includes('اداری')) return Briefcase;
  if (t.includes('آموزش')) return GraduationCap;
  if (t.includes('فرهنگی')) return BookOpen;
  if (t.includes('پشتیبانی') || t.includes('تاسیسات')) return Wrench;
  if (t.includes('بهداشت')) return Activity;

  return null;
};

// Recursive Component for Menu Items with Connected Nodes Visuals
const RecursiveMenuItem: React.FC<{ 
  node: NavNode; 
  level: number; 
  onSelect: (t: string) => void;
  activePathLabels: string[];
  isOpen: boolean;
  onToggle: () => void;
}> = ({ node, level, onSelect, activePathLabels, isOpen, onToggle }) => {
  
  // Separator Handling (High Contrast)
  if (node.type === 'separator') {
     return <div className="my-4 border-t-2 border-slate-200 dark:border-slate-700 mx-1 relative z-10" />;
  }

  const safeLabel = node.label || '';
  // Logic: Only show children if they exist, are NOT hidden, AND we are below the max level limit
  const hasChildren = node.children && node.children.length > 0;
  const shouldRenderChildren = hasChildren && !node.hideChildren && level < MAX_TREE_LEVEL;

  const isActive = activePathLabels.includes(safeLabel);
  const isLeafActive = activePathLabels[activePathLabels.length - 1] === safeLabel;

  // State to track which child is open (Accordion logic)
  const [activeChildId, setActiveChildId] = useState<string | null>(() => {
      // Default Open Logic: Only 'g3' (Section 3) should be open initially
      if (level === 0 && node.children?.some(c => c.id === 'g3')) {
          return 'g3';
      }
      return null;
  });
  
  // Auto-expand if in path
  useEffect(() => {
    if (shouldRenderChildren && node.children) {
      const childInPath = node.children.find(c => activePathLabels.includes(c.label));
      if (childInPath) {
        setActiveChildId(childInPath.id);
      }
    }
  }, [activePathLabels, shouldRenderChildren, node.children]);

  // Handle click for leaf nodes or toggles
  const handleRowClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (shouldRenderChildren) {
          onToggle();
      } else {
          onSelect(safeLabel);
      }
  };

  // --- LEVEL 0: ROOT / FASL (Main Trunk) ---
  if (level === 0) {
    const isWiki = node.id === 'grp-wiki';
    return (
       <div className="mb-2 pb-2">
          {/* Header */}
          <div 
            className={`
              flex items-center justify-between cursor-pointer group select-none mb-3 px-1
              ${isActive ? 'opacity-100' : 'opacity-80 hover:opacity-100'} transition-opacity
            `}
            onClick={onToggle}
          >
             <div className="flex items-center gap-3">
                <div className={`
                    p-1.5 rounded-lg transition-colors
                    ${isWiki 
                        ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300' 
                        : isActive 
                            ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-300' 
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 group-hover:bg-slate-200'}
                `}>
                    {isWiki ? <Book size={18} /> : <Hash size={18} />}
                </div>
                <span className="text-base font-black text-slate-800 dark:text-slate-100 tracking-tight">{safeLabel}</span>
             </div>
             {shouldRenderChildren && (
               <ChevronLeft size={16} className={`transition-transform duration-300 text-slate-400 ${isOpen ? '-rotate-90 text-primary-500' : ''}`} />
             )}
          </div>
          
          {/* Children Container (Vertical Trunk) */}
          <div className={`grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : ''}`}>
            <div className="overflow-hidden">
                {/* Vertical Line Container */}
                <div className="mr-5 pr-0 space-y-4 pt-1 border-r-[3px] border-slate-100 dark:border-slate-800/50 relative">
                    {node.children!.map(child => (
                        <RecursiveMenuItem 
                        key={child.id} 
                        node={child} 
                        level={level + 1} 
                        onSelect={onSelect}
                        activePathLabels={activePathLabels}
                        isOpen={activeChildId === child.id} 
                        onToggle={() => setActiveChildId(prev => prev === child.id ? null : child.id)} 
                        />
                    ))}
                </div>
            </div>
          </div>
       </div>
    );
  }

  // --- LEVEL 1: BAKHSH / SECTION (Gostareh, Quality, Position) ---
  if (level === 1) {
    return (
      <div className="relative group mr-5">
         
         {/* Connector Line */}
         <div className="absolute -right-[18px] top-[1.35rem] w-[14px] h-[2px] bg-slate-200 dark:bg-slate-700 rounded-full"></div>
         
         {/* Status Dot (Intersection) */}
         <div className={`
             absolute -right-[6px] top-[1.35rem] -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 z-10 transition-colors duration-300
             ${isOpen ? 'bg-primary-500 shadow-[0_0_0_1px_rgba(16,185,129,0.3)]' : 'bg-slate-300 dark:bg-slate-600'}
         `}></div>

         <div className={`
            rounded-xl border transition-all duration-300 relative bg-white dark:bg-slate-900
            ${isOpen 
                ? 'border-primary-200 dark:border-primary-900 shadow-lg shadow-primary-500/5' 
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}
         `}>
            {/* Header */}
            <div 
                className={`px-3 py-2.5 flex items-center justify-between cursor-pointer transition-colors select-none rounded-xl
                    ${isOpen ? 'bg-primary-50/50 dark:bg-primary-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}
                `}
                onClick={onToggle}
            >
                <div className="flex items-center gap-2.5">
                    {/* No internal dot here anymore */}
                    <span className={`font-bold text-sm ${isOpen ? 'text-primary-900 dark:text-primary-100' : 'text-slate-700 dark:text-slate-300'}`}>
                        {safeLabel}
                    </span>
                </div>
                
                {/* Chevron Arrow at the End (Left) */}
                {shouldRenderChildren && (
                    <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary-500' : ''}`} />
                )}
            </div>
            
            {/* Children Container */}
            {shouldRenderChildren && (
            <div className={`grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : ''}`}>
               <div className="overflow-hidden">
                 <div className="px-1 pb-1 pt-1 bg-slate-50/50 dark:bg-black/20 rounded-b-xl border-t border-slate-100 dark:border-slate-800/50">
                    {node.children!.map(child => (
                        <RecursiveMenuItem 
                        key={child.id}
                        node={child}
                        level={level + 1}
                        onSelect={onSelect}
                        activePathLabels={activePathLabels}
                        isOpen={child.id === activeChildId}
                        onToggle={() => setActiveChildId(prev => prev === child.id ? null : child.id)}
                        />
                    ))}
                 </div>
               </div>
            </div>
            )}
        </div>
      </div>
    );
  }

  // --- LEVEL 2: CATEGORIES (Specialized Services, Admin Affairs) ---
  if (level === 2) {
    return (
      <div className="relative pl-1">
        <div 
            className={`
                group flex items-center gap-2 py-2 px-2 rounded-lg cursor-pointer transition-all duration-200 relative z-10
                ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'}
            `}
            onClick={handleRowClick}
        >
            {/* Plus / Minus Box on Right */}
            <div className="shrink-0 flex items-center justify-center w-5 h-5">
                {shouldRenderChildren ? (
                    <div className={`
                        w-5 h-5 flex items-center justify-center rounded border transition-colors
                        ${isOpen 
                            ? 'bg-primary-50 border-primary-200 text-primary-600 dark:bg-slate-800 dark:border-slate-600 dark:text-primary-400' 
                            : 'bg-white border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-700'}
                    `}>
                        {isOpen ? <Minus size={10} /> : <Plus size={10} />}
                    </div>
                ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                )}
            </div>

            <span className={`truncate flex-1 text-sm font-bold ${isActive ? 'text-primary-600' : 'text-slate-700 dark:text-slate-300'}`}>
                {safeLabel}
            </span>

            {/* No Chevron on Left for Level 2 */}
        </div>
        
        {/* Children */}
        {shouldRenderChildren && (
            <div className={`
                grid grid-rows-[0fr] transition-[grid-template-rows] duration-200 ease-out
                ${isOpen ? 'grid-rows-[1fr]' : ''}
            `}>
                <div className="overflow-hidden">
                    <div className="relative pr-3 mr-2.5 border-r border-slate-200 dark:border-slate-800 my-1">
                        {node.children!.map(child => (
                            <RecursiveMenuItem 
                            key={child.id} 
                            node={child} 
                            level={level + 1} 
                            onSelect={onSelect}
                            activePathLabels={activePathLabels}
                            isOpen={child.id === activeChildId}
                            onToggle={() => setActiveChildId(prev => prev === child.id ? null : child.id)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        )}
      </div>
    );
  }

  // --- LEVEL 3+: TREE ITEMS (Leaves / Specific Items) ---
  
  const CustomIcon = getIconComponent(safeLabel);
  const isFolder = shouldRenderChildren;
  
  return (
    <div className="relative pl-1">
      {/* The Row */}
      <div 
        className={`
            group flex items-center gap-2 py-2 px-2 rounded-lg cursor-pointer transition-all duration-200 relative z-10
            ${isLeafActive 
                ? 'bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 font-bold shadow-sm ring-1 ring-slate-100 dark:ring-slate-700' 
                : isActive 
                    ? 'text-primary-600 dark:text-primary-400' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 hover:shadow-sm'}
        `}
        onClick={handleRowClick}
      > 
        {/* Icon */}
        <div className="shrink-0 flex items-center justify-center w-5 h-5">
            {CustomIcon ? (
                <CustomIcon size={16} className={isActive || isLeafActive ? 'text-primary-500' : 'text-slate-400 group-hover:text-slate-500'} />
            ) : (
                isFolder ? (
                    <FolderOpen size={16} strokeWidth={2} className={isActive || isLeafActive ? 'text-primary-500' : 'text-slate-400 group-hover:text-slate-500'} />
                ) : (
                    isLeafActive ? (
                        <div className="w-2 h-2 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    ) : (
                        null
                    )
                )
            )}
        </div>

        <span className={`truncate flex-1 ${isFolder ? 'text-sm font-bold' : 'text-sm'}`}>
          {safeLabel}
        </span>

        {/* Expand Icon */}
        {shouldRenderChildren && (
            <ChevronDown size={14} className={`text-slate-300 transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary-400' : ''}`} />
        )}
      </div>
      
      {/* Children */}
      {shouldRenderChildren && (
        <div className={`
            grid grid-rows-[0fr] transition-[grid-template-rows] duration-200 ease-out
            ${isOpen ? 'grid-rows-[1fr]' : ''}
        `}>
            <div className="overflow-hidden">
                <div className="relative pr-3 mr-2.5 border-r border-slate-200 dark:border-slate-800 my-1">
                    {node.children!.map(child => (
                        <RecursiveMenuItem 
                        key={child.id} 
                        node={child} 
                        level={level + 1} 
                        onSelect={onSelect}
                        activePathLabels={activePathLabels}
                        isOpen={child.id === activeChildId}
                        onToggle={() => setActiveChildId(prev => prev === child.id ? null : child.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ 
  treeData, 
  onSelectTopic, 
  currentTopic, 
  isPinned, 
  onTogglePin,
  isMobileMenuOpen,
  onCloseMobileMenu,
  onEditTree
}) => {
  const [activePath, setActivePath] = useState<NavNode[]>([]);
  const [openRootId, setOpenRootId] = useState<string | null>('grp-functional'); 

  useEffect(() => {
    if (currentTopic === 'صفحه اصلی') {
      setActivePath([]);
    } else {
      const path = findPath(treeData, currentTopic);
      if (path) {
        setActivePath(path);
        if (path.length > 0) {
            setOpenRootId(path[0].id);
        }
      }
    }
  }, [currentTopic, treeData]);

  const activePathLabels = activePath.map(n => n.label || '');

  const handleSelect = (topic: string) => {
    onSelectTopic(topic);
    onCloseMobileMenu();
  };

  // Reusable Menu Content
  const MenuContent = () => (
    <>
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur sticky top-0 z-20">
            <div className="flex items-center gap-2">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1.5 rounded-lg text-slate-600 dark:text-slate-300">
                <List size={18} />
            </div>
            <span className="font-bold text-base text-slate-800 dark:text-slate-100">فهرست مطالب</span>
            </div>
            
            <div className="flex items-center gap-1">
                {/* Desktop Pin Toggle inside Menu */}
                <button 
                    onClick={onTogglePin}
                    className="hidden md:flex p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                    title={isPinned ? "برداشتن پین" : "پین کردن منو"}
                >
                    {isPinned ? <PanelRightClose size={18} /> : <Pin size={18} />}
                </button>

                {/* Mobile Close */}
                <button 
                    onClick={onCloseMobileMenu}
                    className="md:hidden p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                    <X size={18} />
                </button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar" dir="rtl">
            {treeData.map((rootNode) => (
            <RecursiveMenuItem 
                key={rootNode.id}
                node={rootNode} 
                level={0} 
                onSelect={handleSelect} 
                activePathLabels={activePathLabels}
                isOpen={rootNode.id === openRootId}
                onToggle={() => setOpenRootId(prev => prev === rootNode.id ? null : rootNode.id)}
            />
            ))}
            
            <div className="mt-8 pt-4 pb-2 border-t border-slate-100 dark:border-slate-800">
               {onEditTree && (
                   <button 
                    onClick={onEditTree}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors mb-2"
                   >
                       <Settings size={16} />
                       <span className="text-xs font-bold">مدیریت ساختار</span>
                   </button>
               )}
               <p className="text-[10px] text-center text-slate-400">© ۱۴۰۳ دانشنامه دارالشفاء کوثر</p>
            </div>
        </div>
    </>
  );

  return (
    <>
      {/* 1. Pinned Sidebar (Desktop Only - Static Flow in Flex Container) */}
      {isPinned && (
        <div className="hidden md:flex w-80 flex-col border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 transition-all duration-300">
             <MenuContent />
        </div>
      )}

      {/* 2. Overlay Drawer (Mobile or Unpinned Desktop) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex justify-start isolate">
           {/* Backdrop */}
           <div 
             className="absolute inset-0 bg-slate-900/20 dark:bg-black/60 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-200"
             onClick={onCloseMobileMenu}
           ></div>
           
           {/* Drawer */}
           <div className="relative w-full max-w-sm h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-slate-200 dark:border-slate-800">
              <MenuContent />
           </div>
        </div>
      )}
    </>
  );
};

export const TopBar: React.FC<TopBarProps> = ({ 
  currentTopic, 
  isPinned, 
  onToggleMobileMenu 
}) => {
  return (
    <div className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 transition-all duration-300 h-14 flex items-center z-10 sticky top-0">
        <div className="max-w-[1920px] w-full mx-auto px-4">
          <div className="flex items-center gap-4">
            
            {/* Menu Trigger Button */}
            {/* Show hamburger if: Mobile OR (Desktop AND Not Pinned) */}
            <button
              onClick={onToggleMobileMenu}
              className={`
                 flex items-center gap-2 px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all group border border-transparent hover:border-slate-200 dark:hover:border-slate-700
                 ${isPinned ? 'md:hidden' : 'flex'}
              `}
            >
              <List size={20} className="group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
              <span className="text-sm font-bold hidden sm:block">فهرست مطالب</span>
            </button>

            {currentTopic && currentTopic !== 'صفحه اصلی' && (
              <div className="flex items-center animate-in fade-in slide-in-from-right-4 duration-500">
                 <div className={`h-5 w-px bg-slate-200 dark:bg-slate-700 mx-3 hidden sm:block ${!isPinned ? 'block' : 'hidden md:block'}`}></div>
                 <div className="flex items-center gap-2 text-primary-700 dark:text-primary-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></div>
                    <span className="text-sm md:text-base font-black tracking-tight">{currentTopic}</span>
                 </div>
              </div>
            )}
          </div>
        </div>
    </div>
  );
};
