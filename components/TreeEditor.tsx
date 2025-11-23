
import React, { useState } from 'react';
import { NavNode } from '../types';
import { Trash2, Plus, Save, X, Edit2, FileSpreadsheet, LayoutList, Check } from 'lucide-react';
import ImageUploader from './ImageUploader';

interface TreeEditorProps {
  initialData: NavNode[];
  onSave: (data: NavNode[]) => void;
  onClose: () => void;
}

const TreeEditor: React.FC<TreeEditorProps> = ({ initialData, onSave, onClose }) => {
  const [data, setData] = useState<NavNode[]>(initialData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editImage, setEditImage] = useState<string | undefined>(undefined);
  
  const [isImportMode, setIsImportMode] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);

  // Helper to update a node recursively
  const updateNode = (nodes: NavNode[], id: string, transform: (node: NavNode) => NavNode): NavNode[] => {
    return nodes.map(node => {
      if (node.id === id) return transform(node);
      if (node.children) return { ...node, children: updateNode(node.children, id, transform) };
      return node;
    });
  };

  // Helper to delete a node recursively
  const deleteNode = (nodes: NavNode[], id: string): NavNode[] => {
    return nodes.filter(node => node.id !== id).map(node => ({
      ...node,
      children: node.children ? deleteNode(node.children, id) : undefined
    }));
  };

  // Helper to add a child node
  const addChild = (nodes: NavNode[], parentId: string, newId: string): NavNode[] => {
    return nodes.map(node => {
      if (node.id === parentId) {
        const newChild: NavNode = { id: newId, label: 'عنوان جدید', children: [] };
        return { ...node, children: [...(node.children || []), newChild] };
      }
      if (node.children) return { ...node, children: addChild(node.children, parentId, newId) };
      return node;
    });
  };

  const handleRename = (node: NavNode) => {
    setEditingId(node.id);
    setEditValue(node.label);
    setEditImage(node.imageUrl);
  };

  const saveRename = () => {
    if (editingId) {
      setData(prev => updateNode(prev, editingId, n => ({ ...n, label: editValue, imageUrl: editImage })));
      setEditingId(null);
      setEditValue('');
      setEditImage(undefined);
    }
  };

  const cancelRename = () => {
      setEditingId(null);
      setEditValue('');
      setEditImage(undefined);
  };

  const handleDelete = (id: string) => {
    if (confirm('آیا از حذف این شاخه و تمام زیرمجموعه‌های آن اطمینان دارید؟')) {
      setData(prev => deleteNode(prev, id));
    }
  };

  const handleAddChild = (parentId: string) => {
    const newId = `${parentId}-${Math.floor(Math.random() * 10000)}`;
    setData(prev => addChild(prev, parentId, newId));
  };
  
  const handleAddRoot = () => {
      const newId = `g${Math.floor(Math.random() * 1000)}`;
      setData([...data, { id: newId, label: 'گفتار جدید', children: [] }]);
  }

  const handleImportChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setImportText(e.target.value);
    setImportError(null);
  };

  const handleImport = () => {
    const lines = importText.trim().split('\n');
    const nodeMap = new Map<string, NavNode>();
    const roots: NavNode[] = [];
    
    if (lines.length === 0 || !importText.trim()) {
        setImportError("متنی برای پردازش یافت نشد.");
        return;
    }

    // 1. Parse all lines
    lines.forEach(line => {
        line = line.trim();
        if (!line) return;
        
        // Try tab split first (Excel copy paste)
        let parts = line.split('\t');
        let code = '';
        let label = '';
        
        if (parts.length >= 2) {
            code = parts[0].trim();
            label = parts.slice(1).join(' ').trim();
        } else {
            // Fallback to regex if tabs are lost (Space separation)
            const match = line.match(/^([0-9\.-]+)\s+(.+)$/);
            if (match) {
                code = match[1];
                label = match[2];
            } else {
                return; 
            }
        }
        
        // Normalize ID
        const id = `node-${code.replace(/[\.-]/g, '-')}`;
        nodeMap.set(code, {
            id,
            label: label, // Just the title, no code
            children: []
        });
    });

    // 2. Build Hierarchy
    const sortedCodes = Array.from(nodeMap.keys()).sort((a, b) => {
        return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
    });

    sortedCodes.forEach(code => {
        const node = nodeMap.get(code)!;
        
        const separator = code.includes('.') ? '.' : '-';
        const lastSepIndex = code.lastIndexOf(separator);
        
        if (lastSepIndex > 0) {
            const parentCode = code.substring(0, lastSepIndex);
            const parent = nodeMap.get(parentCode);
            if (parent) {
                parent.children = parent.children || [];
                parent.children.push(node);
            } else {
                roots.push(node);
            }
        } else {
            roots.push(node);
        }
    });

    if (roots.length === 0) {
        setImportError("ساختار درختی شناسایی نشد. لطفا از فرمت: [کد] [تب] [عنوان] استفاده کنید.");
        return;
    }

    onSave(roots);
  };

  const renderNode = (node: NavNode, level: number) => {
    const isEditing = editingId === node.id;

    return (
      <div key={node.id} className="mb-2">
        <div 
          className={`
            flex items-start gap-2 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded transition-colors
            ${isEditing ? 'ring-2 ring-primary-200 border-primary-400 dark:ring-primary-900' : 'hover:bg-slate-50 dark:hover:bg-slate-700'}
          `}
          style={{ marginRight: `${level * 20}px` }}
        >
          {isEditing ? (
            <div className="flex flex-col gap-3 w-full p-1">
               <div className="flex items-center gap-2 w-full">
                  <input 
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    className="flex-1 border border-primary-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 ring-offset-0 dark:bg-slate-700 dark:text-white"
                    autoFocus
                    placeholder="عنوان را وارد کنید..."
                  />
                  <button onClick={saveRename} className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors" title="ذخیره"><Check size={16} /></button>
                  <button onClick={cancelRename} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors" title="لغو"><X size={16} /></button>
               </div>
               
               <div className="w-full bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                   <p className="text-xs font-bold text-slate-500 mb-2">تصویر شاخص (آیکون):</p>
                   <div className="max-w-[200px]">
                       <ImageUploader 
                          folder="icons"
                          currentImage={editImage}
                          onUpload={(url) => setEditImage(url)}
                          onRemove={() => setEditImage(undefined)}
                       />
                   </div>
               </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 flex-1 min-w-0 py-1">
                  {node.imageUrl && (
                      <img src={node.imageUrl} alt="" className="w-6 h-6 rounded object-cover border border-slate-200 dark:border-slate-600" />
                  )}
                  <span className="text-sm text-slate-700 dark:text-slate-300 font-medium truncate">{node.label}</span>
              </div>
              
              <div className="flex items-center gap-1 opacity-50 hover:opacity-100 transition-opacity">
                <button onClick={() => handleRename(node)} className="p-1.5 hover:bg-primary-100 dark:hover:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-lg transition-colors" title="ویرایش"><Edit2 size={14} /></button>
                <button onClick={() => handleAddChild(node.id)} className="p-1.5 hover:bg-green-100 dark:hover:bg-green-900 text-green-600 dark:text-green-400 rounded-lg transition-colors" title="افزودن زیرمجموعه"><Plus size={14} /></button>
                <button onClick={() => handleDelete(node.id)} className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 rounded-lg transition-colors" title="حذف"><Trash2 size={14} /></button>
              </div>
            </>
          )}
        </div>
        {node.children && node.children.map(child => renderNode(child, level + 1))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-slate-50 dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] border border-slate-200 dark:border-slate-700 transition-colors">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-t-xl flex justify-between items-center">
          <div className="flex items-center gap-4">
             <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">مدیریت ساختار درختواره</h2>
             <button 
               onClick={() => setIsImportMode(!isImportMode)}
               className="flex items-center gap-1 text-xs px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-green-50 dark:hover:bg-green-900/20 text-slate-600 dark:text-slate-300 hover:text-green-700 dark:hover:text-green-400 rounded-full border border-slate-300 dark:border-slate-600 transition-colors"
             >
               {isImportMode ? <LayoutList size={14} /> : <FileSpreadsheet size={14} />}
               <span>{isImportMode ? 'ویرایش بصری' : 'ورود از اکسل'}</span>
             </button>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"><X size={20} /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 relative custom-scrollbar">
          {isImportMode ? (
            <div className="h-full flex flex-col">
              <div className="mb-2 p-3 bg-primary-50 dark:bg-primary-900/20 text-primary-800 dark:text-primary-200 text-xs rounded border border-primary-200 dark:border-primary-800 leading-relaxed">
                <p className="font-bold mb-1">راهنمای ورود اطلاعات از اکسل:</p>
                <ul className="list-disc list-inside">
                    <li>دو ستون را از اکسل کپی کنید: <strong>کد سطح</strong> و <strong>عنوان</strong>.</li>
                    <li>فرمت باید به صورت: <code>1.1 [تب] عنوان</code> باشد.</li>
                    <li>کدها برای تشخیص زیرمجموعه‌ها استفاده شده اما در درختواره نهایی نمایش داده نمی‌شوند.</li>
                </ul>
              </div>
              <textarea 
                className="flex-1 w-full font-mono text-sm p-4 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800"
                value={importText}
                onChange={handleImportChange}
                dir="ltr"
                placeholder="1.1	Example Title&#10;1.1.1	Subtitle..."
                spellCheck={false}
              />
              {importError && (
                <div className="mt-2 text-red-600 dark:text-red-400 text-xs font-bold bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-100 dark:border-red-800">
                  {importError}
                </div>
              )}
            </div>
          ) : (
            <>
              {data.length === 0 && (
                  <div className="text-center py-10 text-slate-400 text-sm">
                      هیچ آیتمی وجود ندارد. از دکمه "ورود از اکسل" یا "افزودن گفتار" استفاده کنید.
                  </div>
              )}
              {data.map(node => renderNode(node, 0))}
              
              <button 
                 onClick={handleAddRoot}
                 className="w-full py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-slate-500 dark:text-slate-400 hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center justify-center gap-2 mt-4"
              >
                 <Plus size={18} />
                 <span>افزودن گفتار جدید (ریشه)</span>
              </button>
            </>
          )}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-b-xl flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">انصراف</button>
          <button 
            onClick={isImportMode ? handleImport : () => onSave(data)}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium shadow-sm hover:bg-primary-700 transition-colors"
          >
            {isImportMode ? 'پردازش و ذخیره' : 'ذخیره تغییرات'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TreeEditor;
