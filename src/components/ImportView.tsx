import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ArrowRight, 
  Download,
  Trash2,
  Table as TableIcon
} from 'lucide-react';
import type { LinkedInLead } from '../types/lead.ts';
import { parseCSV, mapCsvRecordsToLeads, getSampleLinkedInCsv } from '../utils/csvParser.ts';

interface ImportViewProps {
  onImportComplete: (result: { imported: number; skipped: number; total: number }) => void;
  onCancel?: () => void;
  isModal?: boolean;
}

export const ImportView: React.FC<ImportViewProps> = ({
  onImportComplete,
  onCancel,
  isModal = false,
}) => {
  const [csvContent, setCsvContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [parsedLeads, setParsedLeads] = useState<Partial<LinkedInLead>[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState<{ imported: number; skipped: number; total: number } | null>(null);
  const [activeInputTab, setActiveInputTab] = useState<'upload' | 'paste'>('upload');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcessCsvString = (text: string, sourceName = 'pasted_data.csv') => {
    try {
      setErrorMsg('');
      const rawRecords = parseCSV(text);
      if (rawRecords.length === 0) {
        setErrorMsg('The CSV file appears to be empty or formatted incorrectly.');
        setParsedLeads([]);
        return;
      }

      const leads = mapCsvRecordsToLeads(rawRecords);
      if (leads.length === 0) {
        setErrorMsg('Could not detect prospect records from the CSV file.');
        setParsedLeads([]);
        return;
      }

      setFileName(sourceName);
      setParsedLeads(leads);
    } catch (err: any) {
      setErrorMsg('Error parsing CSV: ' + (err.message || 'Invalid CSV syntax'));
      setParsedLeads([]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      setErrorMsg('Please select a valid .csv file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      setCsvContent(text);
      handleProcessCsvString(text, file.name);
    };
    reader.onerror = () => {
      setErrorMsg('Failed to read file.');
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      setErrorMsg('Please upload a .csv file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      setCsvContent(text);
      handleProcessCsvString(text, file.name);
    };
    reader.readAsText(file);
  };

  const handleLoadSample = () => {
    const sample = getSampleLinkedInCsv();
    setCsvContent(sample);
    setActiveInputTab('paste');
    handleProcessCsvString(sample, 'sample_linkedin_prospects.csv');
  };

  const handleCommitImport = async () => {
    if (parsedLeads.length === 0) return;

    try {
      setIsProcessing(true);
      setErrorMsg('');

      const res = await fetch('/api/leads/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leads: parsedLeads }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Import request failed');
      }

      const result = await res.json();
      setImportResult(result);
      onImportComplete(result);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to complete import');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setCsvContent('');
    setFileName('');
    setParsedLeads([]);
    setErrorMsg('');
    setImportResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={`linkedin-card overflow-hidden ${isModal ? '' : 'p-6'}`}>
      <div className="border-b border-[#e0dfdc] pb-4 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[#191919] flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-[#0a66c2] text-white flex items-center justify-center font-bold text-xs">
                in
              </span>
              <span>Import LinkedIn Prospects</span>
            </h2>
            <p className="text-xs text-[#666666] mt-0.5">
              Bulk import leads exported from LinkedIn Sales Navigator, Apollo, or prospecting spreadsheets.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLoadSample}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-[#0a66c2] bg-[#ebf4fd] border border-[#0a66c2] rounded-full hover:bg-[#d0e8ff] transition-all whitespace-nowrap self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Sample LinkedIn Prospects</span>
          </button>
        </div>
      </div>

      {/* Success banner if imported */}
      {importResult && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-800">
            <p className="font-semibold text-sm">
              Successfully imported {importResult.imported} new prospects!
            </p>
            <p className="mt-0.5 text-emerald-700">
              {importResult.skipped > 0
                ? `${importResult.skipped} duplicate or incomplete records were skipped.`
                : 'All rows processed cleanly.'} Current directory total: {importResult.total} leads.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={handleClear}
                className="px-3.5 py-1 bg-white border border-emerald-300 text-emerald-800 rounded-full font-semibold text-xs hover:bg-emerald-50"
              >
                Import Another File
              </button>
            </div>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {!importResult && (
        <div className="space-y-5">
          {/* Method tabs */}
          <div className="flex border-b border-[#e0dfdc] text-xs">
            <button
              type="button"
              onClick={() => setActiveInputTab('upload')}
              className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                activeInputTab === 'upload'
                  ? 'border-[#0a66c2] text-[#0a66c2]'
                  : 'border-transparent text-[#666666] hover:text-[#191919]'
              }`}
            >
              Upload CSV File
            </button>
            <button
              type="button"
              onClick={() => setActiveInputTab('paste')}
              className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
                activeInputTab === 'paste'
                  ? 'border-[#0a66c2] text-[#0a66c2]'
                  : 'border-transparent text-[#666666] hover:text-[#191919]'
              }`}
            >
              Paste CSV / Spreadsheet Rows
            </button>
          </div>

          {/* Upload Dropzone */}
          {activeInputTab === 'upload' && (
            <div>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#e0dfdc] hover:border-[#0a66c2] hover:bg-[#ebf4fd]/30 rounded-xl p-8 text-center cursor-pointer transition-colors"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".csv,text/csv"
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-[#ebf4fd] text-[#0a66c2] flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-[#191919] mb-1">
                  {fileName ? fileName : 'Upload your prospect CSV or drag & drop here'}
                </h4>
                <p className="text-xs text-[#666666]">
                  Supports standard LinkedIn Sales Navigator, Apollo, and HubSpot export headers
                </p>
              </div>
            </div>
          )}

          {/* Paste CSV tab */}
          {activeInputTab === 'paste' && (
            <div>
              <label className="block text-xs font-semibold text-[#191919] mb-1.5">
                Paste raw CSV text with headers:
              </label>
              <textarea
                rows={6}
                value={csvContent}
                onChange={(e) => {
                  setCsvContent(e.target.value);
                  handleProcessCsvString(e.target.value, 'pasted_data.csv');
                }}
                placeholder={`"Full Name","Job Title","Company","LinkedIn URL","Email","Status"\n"Elena Rostova","VP Growth","DataNexus","https://linkedin.com/in/...","elena@datanexus.io","New"`}
                className="w-full p-3 font-mono text-xs bg-[#f3f2ef] border border-[#e0dfdc] rounded text-[#191919] focus:bg-white focus:ring-1 focus:ring-[#0a66c2] focus:outline-none"
              />
            </div>
          )}

          {/* Live Preview Table */}
          {parsedLeads.length > 0 && (
            <div className="border border-[#e0dfdc] rounded-lg overflow-hidden bg-white">
              <div className="px-4 py-3 bg-[#f9fafb] border-b border-[#e0dfdc] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TableIcon className="w-4 h-4 text-[#0a66c2]" />
                  <span className="text-xs font-semibold text-[#191919]">
                    Detected {parsedLeads.length} LinkedIn Prospects
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs text-[#666666] hover:text-[#cc1016] flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              </div>

              <div className="overflow-x-auto max-h-60">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f3f2ef] text-[#666666] text-[11px] uppercase tracking-wider sticky top-0">
                    <tr>
                      <th className="py-2 px-3">#</th>
                      <th className="py-2 px-3">Name</th>
                      <th className="py-2 px-3">Role</th>
                      <th className="py-2 px-3">Company</th>
                      <th className="py-2 px-3">Status</th>
                      <th className="py-2 px-3">Degree</th>
                      <th className="py-2 px-3">Email</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e0dfdc] bg-white">
                    {parsedLeads.slice(0, 8).map((l, idx) => (
                      <tr key={idx} className="hover:bg-[#f3f2ef]">
                        <td className="py-2 px-3 font-mono text-[#666666]">{idx + 1}</td>
                        <td className="py-2 px-3 font-bold text-[#191919]">{l.fullName}</td>
                        <td className="py-2 px-3 text-[#666666]">{l.jobTitle}</td>
                        <td className="py-2 px-3 text-[#191919]">{l.company}</td>
                        <td className="py-2 px-3">
                          <span className="px-2 py-0.5 rounded-full bg-[#ebf4fd] text-[#0a66c2] text-[10px] font-semibold">
                            {l.status}
                          </span>
                        </td>
                        <td className="py-2 px-3 font-mono text-[#666666]">{l.connectionDegree}</td>
                        <td className="py-2 px-3 text-[#666666] font-mono text-[11px]">
                          {l.email || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {parsedLeads.length > 8 && (
                <div className="p-2 text-center text-xs text-[#666666] border-t border-[#e0dfdc] bg-[#f9fafb]">
                  ... and {parsedLeads.length - 8} more leads ready
                </div>
              )}

              {/* Commit Action Footer */}
              <div className="p-4 bg-white border-t border-[#e0dfdc] flex items-center justify-between">
                <span className="text-xs text-[#666666]">
                  Records will be added to your persistent database.
                </span>

                <div className="flex items-center gap-2">
                  {onCancel && (
                    <button
                      type="button"
                      onClick={onCancel}
                      className="px-3.5 py-1.5 text-xs text-[#666666] hover:text-[#191919]"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleCommitImport}
                    disabled={isProcessing}
                    className="flex items-center gap-1.5 px-5 py-2 bg-[#0a66c2] hover:bg-[#004182] text-white rounded-full text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
                  >
                    <span>{isProcessing ? 'Importing Prospects...' : `Import ${parsedLeads.length} Prospects`}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
