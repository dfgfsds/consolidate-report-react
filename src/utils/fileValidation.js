import * as XLSX from 'xlsx';

/**
 * Normalizes a string by trimming, lowercasing, and replacing multiple spaces with a single space.
 */
const normalizeString = (str) => {
  return String(str || '').trim().toLowerCase().replace(/\s+/g, ' ');
};

/**
 * Scans the first N rows of a sheet to find the best matching header row.
 */
const findHeaderRow = (rows, requiredHeaders) => {
  const normalizedRequired = requiredHeaders.map(normalizeString);
  let bestMatch = { index: -1, headers: [], matchCount: -1 };

  // Scan first 20 rows
  const scanLimit = Math.min(rows.length, 20);

  for (let i = 0; i < scanLimit; i++) {
    const currentRow = (rows[i] || []).map(normalizeString);
    const matches = normalizedRequired.filter(h => currentRow.includes(h)).length;

    console.groupCollapsed(`[Validation Debug] Inspecting row ${i}`);
    console.log(`Raw:`, rows[i]);
    console.log(`Normalized:`, currentRow);
    console.log(`Matches: ${matches}/${normalizedRequired.length}`);
    console.groupEnd();

    if (matches > bestMatch.matchCount) {
      bestMatch = { index: i, headers: currentRow, matchCount: matches };
    }

    // If we find a perfect match, stop early
    if (matches === normalizedRequired.length) break;
  }

  return bestMatch;
};

/**
 * Validates file based on filename keyword and optionally internal headers.
 * @param {File} file - The file object to validate.
 * @param {string} keyword - The keyword to look for in the filename (e.g., 'stock').
 * @param {string[]} requiredHeaders - List of mandatory headers to check inside the file.
 * @returns {Promise<{isValid: boolean, error: string | null}>}
 */
export const validateFile = async (file, keyword, requiredHeaders = []) => {
  // 1. Basic Filename Validation (RegEx for safe chars)
  const baseName = file.name.split('.')[0];
  if (!/^[a-zA-Z0-9_-]+$/.test(baseName)) {
    return {
      isValid: false,
      error: 'File name should not contain spaces or special characters (only _ and - allowed).'
    };
  }

  // 2. Keyword Validation
  if (!file.name.toLowerCase().includes(keyword.toLowerCase())) {
    return {
      isValid: false,
      error: `Please upload a valid ${keyword} file. The filename must contain "${keyword}".`
    };
  }

  // 3. Header Validation (Optional/Premium)
  if (requiredHeaders.length > 0) {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      // Get data as 2D array
      const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      console.log(`%c[Validation Debug] Starting header detection for: ${file.name}`, "color: #3b82f6; font-weight: bold");
      const bestMatch = findHeaderRow(rows, requiredHeaders);
      
      console.log(`%c[Validation Debug] Best header row index detected: ${bestMatch.index}`, "color: #10b981; font-weight: bold");
      console.log(`%c[Validation Debug] Final Headers:`, "color: #10b981", bestMatch.headers);

      const normalizedRequired = requiredHeaders.map(normalizeString);
      const missingHeaders = requiredHeaders.filter(
        (h, index) => !bestMatch.headers.includes(normalizedRequired[index])
      );

      if (missingHeaders.length > 0) {
        return {
          isValid: false,
          error: `Invalid file structure. Missing columns: ${missingHeaders.join(', ')}`
        };
      }
    } catch (err) {
      console.error('Validation error:', err);
      return {
        isValid: false,
        error: 'Error reading file structure. Please ensure it is a valid Excel/CSV file.'
      };
    }
  }

  return { isValid: true, error: null };
};
