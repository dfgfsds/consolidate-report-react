import React from 'react';
import { Info, Download, FileSpreadsheet, AlertCircle, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';

const ExcelFormatCard = ({ headers, moduleName, onDownloadSample }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-md hover:shadow-xl transition-all duration-500 h-full flex flex-col group/card">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner group-hover/card:scale-110 transition-transform duration-300">
          <FileSpreadsheet size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Required Excel Format</h3>
          <p className="text-sm text-gray-500">Standard file structure guide</p>
        </div>
      </div>

      <div className="space-y-6 flex-grow">
        {/* Section 1: Instructions */}
        <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100/50">
          <div className="flex gap-3">
            <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800 leading-relaxed font-medium">
              Ensure your file contains these exact column names in the first row.
            </p>
          </div>
        </div>

        {/* Section 2: Headers */}
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {headers.map((header, index) => (
              <span
                key={index}
                className="px-4 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold rounded-full shadow-sm hover:bg-white hover:border-blue-300 hover:text-blue-600 transition-all cursor-default"
              >
                {header}
              </span>
            ))}
          </div>
        </div>

        {/* Section 3: File Naming Rules */}
        <div className="pt-6 border-t border-gray-100 space-y-4">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            <span>File Naming Rules</span>
          </div>

          <ul className="space-y-2.5 ml-1">
            <li className="flex items-start gap-2.5 text-sm text-gray-600">
              <span className="text-blue-500 mt-1">•</span>
              <span>File name should NOT contain spaces</span>
            </li>
            <li className="flex items-start gap-2.5 text-sm text-gray-600">
              <span className="text-blue-500 mt-1">•</span>
              <span>Only letters, numbers, underscore (_) and hyphen (-) allowed</span>
            </li>
          </ul>

          <div className="grid grid-cols-1 gap-2 p-3 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
            <div className="flex items-center gap-2 text-xs">
              <CheckCircle2 size={14} className="text-emerald-500" />
              <code className="text-gray-700 font-semibold bg-white px-2 py-0.5 rounded border border-gray-100">valid-file.xlsx</code>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <XCircle size={14} className="text-rose-500" />
              <code className="text-gray-400 line-through bg-white px-2 py-0.5 rounded border border-gray-100">invalid file.xlsx</code>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Action */}
      <div className="mt-8 space-y-4">
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-red-50 text-red-600 border border-red-100">
          <AlertCircle size={18} className="shrink-0" />
          <p className="text-[11px] leading-tight font-bold uppercase tracking-wider">
            File will be rejected if headers or file name do not match requirements
          </p>
        </div>

        <button
          onClick={onDownloadSample}
          className="w-full flex items-center justify-center gap-3 py-4 bg-gray-900 text-white rounded-2xl text-sm font-bold hover:bg-gray-800 active:scale-[0.98] transition-all shadow-lg shadow-gray-200 group/btn"
        >
          <Download size={18} className="group-hover/btn:translate-y-0.5 transition-transform" />
          <span>Download Sample File</span>
          <ChevronRight size={16} className="ml-auto opacity-50 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default ExcelFormatCard;
