


export function validateFileType(file) {
  const allowedTypes = [
    'text/plain',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
    'application/msword' 
  ];
  
  const allowedExtensions = ['.txt', '.pdf', '.docx', '.doc'];
  
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  
  if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
    return {
      valid: false,
      error: 'Please upload a TXT, PDF, DOC, or DOCX file'
    };
  }
  
  
  const maxSize = 5 * 1024 * 1024; 
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size must be less than 5MB'
    };
  }
  
  return { valid: true, error: null };
}


export async function parseTextFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    
    reader.onerror = (error) => {
      reject(new Error('Failed to read file: ' + error.message));
    };
    
    reader.readAsText(file);
  });
}


export async function parseResumePDF(file) {
  return new Promise(async (resolve, reject) => {
    try {
      if (!window.pdfjsLib) {
        throw new Error('PDF library not loaded. Please ensure you have an internet connection.');
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const typedarray = new Uint8Array(e.target.result);
          const pdf = await window.pdfjsLib.getDocument(typedarray).promise;
          let fullText = '';
          
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n';
          }
          
          resolve(fullText);
        } catch (err) {
          reject(new Error('Failed to parse PDF: ' + err.message));
        }
      };
      
      reader.onerror = (err) => reject(new Error('File reader error: ' + err.message));
      reader.readAsArrayBuffer(file);
    } catch (error) {
      reject(error);
    }
  });
}


export async function parseResumeDocx(file) {
  return new Promise((resolve, reject) => {
    try {
      if (!window.mammoth) {
        throw new Error('Word parser library not loaded. Please ensure you have an internet connection.');
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target.result;
          const result = await window.mammoth.extractRawText({ arrayBuffer });
          resolve(result.value);
        } catch (err) {
          reject(new Error('Failed to parse DOCX: ' + err.message));
        }
      };
      
      reader.onerror = (err) => reject(new Error('File reader error: ' + err.message));
      reader.readAsArrayBuffer(file);
    } catch (error) {
      reject(error);
    }
  });
}


export async function parseResumeFile(file) {
  try {
    
    const validation = validateFileType(file);
    if (!validation.valid) {
      return {
        success: false,
        text: '',
        error: validation.error
      };
    }
    
    let text = '';
    
    
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      text = await parseTextFile(file);
    } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      text = await parseResumePDF(file);
    } else if (
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.type === 'application/msword' ||
      file.name.endsWith('.docx') ||
      file.name.endsWith('.doc')
    ) {
      text = await parseResumeDocx(file);
    } else {
      return {
        success: false,
        text: '',
        error: 'Unsupported file type'
      };
    }
    
    return {
      success: true,
      text,
      error: null
    };
    
  } catch (error) {
    return {
      success: false,
      text: '',
      error: error.message || 'Failed to parse file'
    };
  }
}


export function validateGitHubUrl(url) {
  try {
    
    if (!url.includes('github.com') && !url.includes('/')) {
      
      return {
        valid: true,
        username: url.trim(),
        error: null
      };
    }
    
    const urlPatterns = [
      /github\.com\/([a-zA-Z0-9-]+)\/?$/,  
      /^([a-zA-Z0-9-]+)$/  
    ];
    
    for (const pattern of urlPatterns) {
      const match = url.match(pattern);
      if (match) {
        return {
          valid: true,
          username: match[1],
          error: null
        };
      }
    }
    
    return {
      valid: false,
      username: null,
      error: 'Invalid GitHub URL. Please use format: github.com/username or just username'
    };
    
  } catch (error) {
    return {
      valid: false,
      username: null,
      error: 'Invalid URL format'
    };
  }
}


export function cleanTextContent(text) {
  return text
    .replace(/\r\n/g, '\n') 
    .replace(/\t/g, ' ') 
    .replace(/ +/g, ' ') 
    .trim();
}
