
import React, { useState, useRef, useEffect } from 'react';
import { WikiArticle } from '../types';
import { Save, X, Bold, Italic, List, Image as ImageIcon, Undo, Redo, AlignRight, AlignLeft, AlignCenter, Type } from 'lucide-react';

interface EditorProps {
  article: WikiArticle;
  onSave: (newContent: string) => void;
  onCancel: () => void;
}

const Editor: React.FC<EditorProps> = ({ article, onSave, onCancel }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  // Sync initial content
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = article.contentHtml;
    }
  }, []);

  const handleCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    const html = e.clipboardData.getData('text/html');

    if (html) {
      // Clean Word Garbage
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Remove style attributes
      doc.body.querySelectorAll('*').forEach(el => {
        el.removeAttribute('style');
        el.removeAttribute('class');
        el.removeAttribute('lang');
        
        // Remove empty spans often left by Word
        if (el.tagName === 'SPAN' && !el.innerHTML.trim()) {
            el.remove();
        }
      });

      // Process Tables to match "Modern Responsive Card" Style
      doc.body.querySelectorAll('table').forEach(table => {
        // Create a wrapper div for responsive scrolling
        const wrapper = document.createElement('div');
        wrapper.className = "overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 mb-6 bg-white dark:bg-slate-800 shadow-sm";
        
        // Insert wrapper before table, then move table inside
        table.parentNode?.insertBefore(wrapper, table);
        wrapper.appendChild(table);

        // Table basic classes
        table.className = "w-full text-sm text-right border-collapse";
        
        // Process Rows (Zebra Striping)
        table.querySelectorAll('tr').forEach((tr, rowIndex) => {
             const isHeaderRow = rowIndex === 0;
             
             // Base row classes
             let trClass = "border-b border-slate-100 dark:border-slate-700 last:border-0 transition-colors ";
             
             if (isHeaderRow) {
                 trClass += "bg-slate-100 dark:bg-slate-900 font-bold text-slate-800 dark:text-slate-200";
             } else {
                 trClass += "hover:bg-slate-50 dark:hover:bg-slate-700/30 ";
                 // Zebra striping logic
                 if (rowIndex % 2 === 0) {
                     trClass += "bg-white dark:bg-slate-800";
                 } else {
                     trClass += "bg-slate-50 dark:bg-slate-800/50";
                 }
             }
             tr.className = trClass;

             // Process Cells in this row
             const cells = tr.querySelectorAll('td, th');
             cells.forEach((cell, cellIndex) => {
                const isFirstCol = cellIndex === 0;
                
                // Base cell classes
                let cellClass = "p-3 whitespace-nowrap md:whitespace-normal ";
                
                if (isHeaderRow || cell.tagName === 'TH') {
                    cellClass += "font-bold border-b border-slate-200 dark:border-slate-700 ";
                } else {
                    cellClass += "text-slate-700 dark:text-slate-300 ";
                }

                // First Column Logic (Sticky & Bold)
                if (isFirstCol) {
                    cellClass += "sticky right-0 z-10 font-bold border-l border-slate-200 dark:border-slate-600 ";
                    
                    // IMPORTANT: Set background to match row so scrolling text doesn't show behind
                    if (isHeaderRow) {
                        cellClass += "bg-slate-100 dark:bg-slate-900 z-20"; // Higher Z for header corner
                    } else {
                         if (rowIndex % 2 === 0) {
                             cellClass += "bg-white dark:bg-slate-800";
                         } else {
                             cellClass += "bg-slate-50 dark:bg-slate-800/50";
                         }
                    }
                }

                cell.className = cellClass;
             });
        });
      });

      // Process Headings
      doc.body.querySelectorAll('h1, h2, h3').forEach(h => {
          const size = h.tagName === 'H2' ? 'text-2xl' : 'text-xl';
          h.className = `${size} font-bold text-slate-800 dark:text-slate-100 mt-6 mb-3 border-b border-slate-200 dark:border-slate-700 pb-2`;
      });
      
      // Process Paragraphs
      doc.body.querySelectorAll('p').forEach(p => {
          p.className = "mb-4 leading-relaxed text-justify text-slate-700 dark:text-slate-300";
      });
      
      // Process Lists
      doc.body.querySelectorAll('ul').forEach(ul => ul.className = "list-disc list-inside mb-4 text-slate-700 dark:text-slate-300");
      doc.body.querySelectorAll('ol').forEach(ol => ol.className = "list-decimal list-inside mb-4 text-slate-700 dark:text-slate-300");

      document.execCommand('insertHTML', false, doc.body.innerHTML);
    } else {
      document.execCommand('insertText', false, text);
    }
  };

  const getCleanContent = () => {
      if (!editorRef.current) return '';
      return editorRef.current.innerHTML;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-primary-100 dark:border-slate-700 overflow-hidden min-h-[80vh] flex flex-col transition-colors duration-300">
      {/* Toolbar */}
      <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-2 flex flex-wrap items-center justify-between sticky top-0 z-10 gap-2">
        <div className="flex flex-wrap items-center gap-1">
           <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-1 shadow-sm">
             <button onClick={() => handleCommand('bold')} className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded hover:text-primary-600" title="Bold"><Bold size={16} /></button>
             <button onClick={() => handleCommand('italic')} className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded hover:text-primary-600" title="Italic"><Italic size={16} /></button>
             <div className="w-px h-5 bg-slate-200 dark:bg-slate-600 mx-1"></div>
             <button onClick={() => handleCommand('formatBlock', 'H2')} className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded hover:text-primary-600 font-bold text-xs" title="Heading 2">H2</button>
             <button onClick={() => handleCommand('formatBlock', 'H3')} className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded hover:text-primary-600 font-bold text-xs" title="Heading 3">H3</button>
             <div className="w-px h-5 bg-slate-200 dark:bg-slate-600 mx-1"></div>
             <button onClick={() => handleCommand('insertUnorderedList')} className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded hover:text-primary-600" title="List"><List size={16} /></button>
             <div className="w-px h-5 bg-slate-200 dark:bg-slate-600 mx-1"></div>
             <button onClick={() => handleCommand('justifyRight')} className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded hover:text-primary-600"><AlignRight size={16} /></button>
             <button onClick={() => handleCommand('justifyCenter')} className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded hover:text-primary-600"><AlignCenter size={16} /></button>
             <button onClick={() => handleCommand('justifyLeft')} className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded hover:text-primary-600"><AlignLeft size={16} /></button>
           </div>
           <div className="text-xs text-slate-400 px-2 hidden md:block">
             قابلیت کپی/پیست مستقیم از Word
           </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={onCancel}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors text-sm"
          >
            <X size={16} />
            لغو
          </button>
          <button 
            onClick={() => onSave(getCleanContent())}
            className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-lg font-medium shadow-md transition-all transform hover:scale-105 text-sm"
          >
            <Save size={16} />
            ذخیره تغییرات
          </button>
        </div>
      </div>

      {/* WYSIWYG Area */}
      <div className="flex-1 relative bg-slate-50 dark:bg-slate-900 overflow-y-auto">
        <div className="max-w-none w-full min-h-full p-8 bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-slate-100 transition-colors">
           <div
            ref={editorRef}
            contentEditable
            onPaste={handlePaste}
            className="outline-none min-h-[60vh] prose prose-slate dark:prose-invert max-w-none prose-p:text-justify prose-img:rounded-lg prose-headings:font-bold focus:prose-p:text-slate-900 dark:focus:prose-p:text-slate-100"
            dir="rtl"
          />
        </div>
      </div>
      
      <div className="bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 px-4 py-2 text-xs text-slate-500 dark:text-slate-400 flex justify-between">
         <span>حالت ویرایش پیشرفته (WYSIWYG)</span>
         <span>پشتیبانی از جداول ریسپانسیو</span>
      </div>
    </div>
  );
};

export default Editor;
