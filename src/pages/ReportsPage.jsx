import React, { useState, useEffect, useMemo } from 'react';
import { FileText, Download, Trash2, Loader2, Search, Filter, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { downloadBlob } from '../utils/download';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await api.get('/reports');
      // The user specified that data.files should be used
      const filesArray = response.data.files || response.data || [];
      
      // Filter reports: Ignore files starting with "~" or containing "lock"
      const filtered = filesArray.filter(
        (file) => typeof file === 'string' && 
                  !file.startsWith('~') && 
                  !file.toLowerCase().includes('lock')
      );
      setReports(filtered);
    } catch (error) {
      console.error('Fetch reports error:', error);
      toast.error('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDownload = async (fileName) => {
    try {
      const response = await api.get(`/reports/${fileName}`, { responseType: 'blob' });
      downloadBlob(response.data, fileName);
      toast.success('Download started');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Download failed');
    }
  };

  const handleDelete = async (fileName) => {
    if (!window.confirm(`Are you sure you want to delete ${fileName}?`)) return;

    setDeleting(fileName);
    try {
      await api.delete(`/reports/${fileName}`);
      toast.success('Report deleted successfully');
      fetchReports();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  const filteredReports = useMemo(() => {
    if (!searchTerm) return reports;
    return reports.filter((report) =>
      report.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [reports, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Generated Reports</h2>
          <p className="text-gray-500 text-sm">Manage and download your processed archive.</p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search reports by name..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={fetchReports} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600 flex items-center gap-2 text-sm font-medium border border-gray-200 px-4 whitespace-nowrap">
            <Filter size={18} />
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed">
          <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />
          <p className="text-gray-500 font-medium">Fetching reports archive...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
            <AlertCircle size={40} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">No reports available</h3>
          <p className="text-gray-500 mt-2 max-w-sm text-center">
            Your generated reports will appear here once you process some stock, sales, or purchase data.
          </p>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-6">
            <Search size={40} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">No reports found</h3>
          <p className="text-gray-500 mt-2 max-w-sm text-center">
            We couldn't find any reports matching "{searchTerm}". Try a different search term.
          </p>
          <button 
            onClick={() => setSearchTerm('')}
            className="mt-6 text-blue-600 font-medium hover:underline text-sm"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <div 
              key={report} 
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleDelete(report)}
                  disabled={deleting === report}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  {deleting === report ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                </button>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <FileText size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate pr-6" title={report}>
                    {report}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">Processed • Excel Document</p>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <button 
                      onClick={() => handleDownload(report)}
                      className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 decoration-2 hover:underline transition-all"
                    >
                      <Download size={16} />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
