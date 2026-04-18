import React, { useState, useRef } from 'react';
import { Upload, Package, CheckCircle2, Loader2, Sparkles, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { downloadBlob, downloadSampleCSV } from '../utils/download';
import ExcelFormatCard from '../components/ExcelFormatCard';
import { validateFile } from '../utils/fileValidation';

const STOCK_HEADERS = [
  'Brand',
  'Category',
  'Company Name',
  'Item Name',
  'Closing Stock On Qty',
  'Stock Value On Purchase Price',
  'Stock Value On Selling Price'
];

const StockPage = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    setValidating(true);
    try {
      for (const file of selectedFiles) {
        const result = await validateFile(file, 'stock', STOCK_HEADERS);
        if (!result.isValid) {
          toast.error(result.error);
          if (fileInputRef.current) fileInputRef.current.value = '';
          setFiles([]);
          return;
        }
      }
      setFiles(selectedFiles);
      toast.success(`${selectedFiles.length} files validated and ready`);
    } catch (error) {
      toast.error('Error validating files');
    } finally {
      setValidating(false);
    }
  };

  const handleProcess = async (endpoint, fileName) => {
    if (files.length === 0) {
      toast.error('Please select files first');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append('file', file));

    try {
      const response = await api.post(endpoint, formData, {
        responseType: 'blob',
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      downloadBlob(response.data, fileName);
      toast.success('Process completed successfully!');
    } catch (error) {
      console.error(error);
      // api interceptor handles toast for non-blob responses usually, 
      // but for blob we might need to parse error json if needed.
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 space-y-4">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 transition-all duration-300 transform hover:rotate-6">
            <Package size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Stock Inventory Management</h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            Upload multiple stock inventory files to consolidate them into a single report or generate a category-wise summary.
          </p>
        </div>

        <div className="w-full md:w-[450px] space-y-6">
          {/* Hidden File Input */}
          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          <div
            onClick={triggerFileInput}
            className={`cursor-pointer group border-2 border-dashed rounded-3xl p-10 transition-all duration-300 flex flex-col items-center justify-center ${files.length > 0 ? 'bg-green-50/50 border-green-200' : 'bg-gray-50 border-gray-200 hover:border-blue-400 hover:bg-white'
              }`}
          >
            {files.length > 0 ? (
              <>
                <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white mb-4 animate-bounce">
                  <CheckCircle2 size={24} />
                </div>
                <p className="text-green-600 font-semibold">{files.length} files selected</p>
                <div className="w-full mt-2 text-center">
                  {files.slice(0, 3).map((f, i) => (
                    <p key={i} className="text-xs text-green-500/70 truncate">{f.name}</p>
                  ))}
                  {files.length > 3 && <p className="text-xs text-green-500/70">...and {files.length - 3} more</p>}
                </div>
              </>
            ) : (
              <>
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-gray-400 mb-4 group-hover:text-blue-500 transition-colors">
                  <Upload size={24} />
                </div>
                <p className="text-gray-600 font-medium">Click to select files</p>
                <p className="text-sm text-gray-400 mt-2">XLSX, CSV or ODS files</p>
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={(e) => { e.stopPropagation(); handleProcess('/stock/consolidate', 'consolidated_stock.xlsx'); }}
              disabled={loading || validating || files.length === 0}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 text-white rounded-2xl font-semibold hover:bg-gray-800 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none group"
            >
              {loading || validating ? <Loader2 className="animate-spin" size={20} /> : <Sparkles className="text-blue-400 group-hover:animate-pulse" size={20} />}
              <span>Consolidate</span>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleProcess('/stock/category-summary', 'category_summary.xlsx'); }}
              disabled={loading || validating || files.length === 0}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none group shadow-lg shadow-blue-500/20"
            >
              {loading || validating ? <Loader2 className="animate-spin" size={20} /> : <FileText className="text-blue-200" size={20} />}
              <span>Summary</span>
            </button>
          </div>
        </div>

        <div className="w-full lg:w-[400px]">
          <ExcelFormatCard
            headers={STOCK_HEADERS}
            moduleName="Stock"
            onDownloadSample={() => downloadSampleCSV(STOCK_HEADERS, 'stock_inventory_sample')}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { title: 'Fast Processing', desc: 'Consolidate thousands of rows in seconds.', color: 'blue' },
          { title: 'Auto-Download', desc: 'Get your processed report instantly.', color: 'green' },
          { title: 'Accurate Results', desc: 'Advanced algorithms for summary generation.', color: 'purple' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 bg-${item.color}-50 text-${item.color}-500 rounded-lg flex items-center justify-center mb-4`}>
              <div className={`w-2 h-2 bg-${item.color}-500 rounded-full`}></div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockPage;
