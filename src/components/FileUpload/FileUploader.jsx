import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDataExtraction } from '../../services/aiExtractor';

export const FileUploader = () => {
  const [files, setFiles] = useState([]);
  const { extractData, loading, error } = useDataExtraction();
  const [processingStatus, setProcessingStatus] = useState({});

  const onDrop = useCallback(async (acceptedFiles) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
    
    for (const file of acceptedFiles) {
      setProcessingStatus(prev => ({
        ...prev,
        [file.name]: 'processing'
      }));

      try {
        const data = await extractData(file);
        
        if (data) {
          setProcessingStatus(prev => ({
            ...prev,
            [file.name]: 'completed'
          }));
        } else {
          setProcessingStatus(prev => ({
            ...prev,
            [file.name]: 'failed'
          }));
        }
      } catch (err) {
        setProcessingStatus(prev => ({
          ...prev,
          [file.name]: 'failed'
        }));
      }
    }
  }, [extractData]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    }
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here...</p>
        ) : (
          <p>Drag 'n' drop files here, or click to select files</p>
        )}
      </div>

      {/* File List */}
      <div className="mt-4">
        {files.map((file) => (
          <div
            key={file.name}
            className="flex items-center justify-between p-2 border-b"
          >
            <span>{file.name}</span>
            <span className="ml-2">
              {processingStatus[file.name] === 'processing' && 'Processing...'}
              {processingStatus[file.name] === 'completed' && '✅ Completed'}
              {processingStatus[file.name] === 'failed' && '❌ Failed'}
            </span>
          </div>
        ))}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded">
          <h3 className="font-bold">Extraction Error</h3>
          <p>{error.message}</p>
          {error.missingFields && (
            <ul className="mt-2 list-disc list-inside">
              {error.missingFields.map((field) => (
                <li key={field}>Missing: {field}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};