export const downloadFile = async (url, fileName) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Download failed');
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
};

export const downloadBlob = (blob, fileName) => {
  const url = window.URL.createObjectURL(new Blob([blob]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const downloadSampleCSV = (headers, fileName) => {
  const content = headers.join(',') + '\n' + headers.map(() => '').join(',');
  const blob = new Blob([content], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${fileName}.csv`);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
  window.URL.revokeObjectURL(url);
};
