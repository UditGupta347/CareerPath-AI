


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
  
  
  return new Promise((resolve) => {
    const message = `PDF file detected: ${file.name}
    
For best results, please:
1. Open the PDF file
2. Copy all text content
3. Use the "Paste Text" option instead

Alternatively, you can save your resume as a .txt file and upload it.`;
    
    resolve(message);
  });
}


export async function parseResumeDocx(file) {
  
  
  return new Promise((resolve) => {
    const message = `Word document detected: ${file.name}
    
For best results, please:
1. Open the Word document
2. Copy all text content
3. Use the "Paste Text" option instead

Alternatively, you can save your resume as a .txt file and upload it.`;
    
    resolve(message);
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
