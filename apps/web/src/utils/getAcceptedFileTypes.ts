import { Accept } from 'react-dropzone';

export function getAcceptedFileTypes(
  referenceFileType: 'word' | 'pdf' | 'excel' | 'text'
): Accept {
  switch (referenceFileType) {
    case 'word':
      return {
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          ['.docx'],
        'application/msword': ['.doc'],
      };
    case 'pdf':
      return {
        'application/pdf': ['.pdf'],
      };
    case 'excel':
      return {
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
          '.xlsx',
        ],
        'application/vnd.ms-excel': ['.xls'],
      };
    case 'text':
      return {
        'text/plain': ['.txt'],
      };
  }
}
