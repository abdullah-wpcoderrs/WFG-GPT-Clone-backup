# Vector Implementation Guide for WFG GPT Clone

## 🎯 **Overview**

This guide provides step-by-step instructions to implement vector chunking, AI context windows, internet search, and PDF generation capabilities in your WFG GPT Clone project.

## 📋 **Prerequisites**

Before starting, ensure you have:
- ✅ Supabase project set up
- ✅ OpenAI API key
- ✅ Node.js environment configured
- ✅ Project dependencies installed

## 🚀 **Implementation Steps**

### **Step 1: Enable Vector Extensions in Supabase**

1. **Access Supabase SQL Editor**:
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Create a new query

2. **Run Vector Extension Setup**:
   ```sql
   -- Execute the contents of supabase/01-vector-extensions.sql
   -- This will enable the vector extension and create all necessary tables
   ```

3. **Verify Installation**:
   ```sql
   -- Check if vector extension is enabled
   SELECT name, default_version, installed_version 
   FROM pg_available_extensions 
   WHERE name = 'vector';
   ```

### **Step 2: Install Required Dependencies**

Add the following dependencies to your project:

```bash
# Core vector processing dependencies
npm install openai
npm install pdf-parse mammoth xlsx marked

# PDF generation dependencies  
npm install puppeteer @mozilla/readability jsdom

# Optional: Enhanced document processing
npm install tesseract.js  # For OCR capabilities
```

### **Step 3: Run Database Setup Scripts**

Execute the SQL scripts in order:

1. **Vector Extensions** (Already done in Step 1)
   ```bash
   # Run: supabase/01-vector-extensions.sql
   ```

2. **Vector Functions**:
   ```bash
   # Run: supabase/02-vector-functions.sql
   ```

3. **RLS Policies**:
   ```bash
   # Run: supabase/03-vector-rls-policies.sql
   ```

### **Step 4: Configure Environment Variables**

Update your `.env` file with the additional variables:

```env
# Internet Search APIs (Optional but recommended)
GOOGLE_SEARCH_API_KEY=your_google_search_api_key_here
GOOGLE_SEARCH_ENGINE_ID=your_custom_search_engine_id_here
BING_SEARCH_API_KEY=your_bing_search_api_key_here

# Vector Configuration
NEXT_PUBLIC_EMBEDDING_MODEL=text-embedding-3-small
NEXT_PUBLIC_VECTOR_DIMENSION=1536
NEXT_PUBLIC_VECTOR_SEARCH_THRESHOLD=0.7

# Document Processing
DOCUMENT_CHUNK_SIZE=1000
DOCUMENT_CHUNK_OVERLAP=200
MAX_DOCUMENT_SIZE_MB=50

# PDF Generation
NEXT_PUBLIC_ENABLE_PDF_GENERATION=true
MAX_PDF_GENERATION_JOBS=10
```

### **Step 5: Set Up Google Custom Search (Optional)**

For internet search functionality:

1. **Create Custom Search Engine**:
   - Go to [Google Custom Search](https://cse.google.com/)
   - Create a new search engine
   - Set it to search the entire web
   - Get your Search Engine ID

2. **Enable Custom Search API**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Enable the Custom Search JSON API
   - Create API key

3. **Configure Rate Limits**:
   - Free tier: 100 queries per day
   - Paid tier: Up to 10,000 queries per day

### **Step 6: Set Up Supabase Storage**

Create storage buckets for file management:

1. **In Supabase Dashboard**:
   - Go to Storage
   - Create buckets:
     - `gpt-desk-files` (for uploaded documents)
     - `generated-pdfs` (for generated PDF files)

2. **Configure Storage Policies**:
   ```sql
   -- Allow authenticated users to upload files
   CREATE POLICY "Users can upload files" ON storage.objects
     FOR INSERT WITH CHECK (auth.role() = 'authenticated');

   -- Users can view files from their team
   CREATE POLICY "Users can view team files" ON storage.objects
     FOR SELECT USING (
       auth.uid() IN (
         SELECT user_id FROM documents 
         WHERE file_url LIKE '%' || name || '%'
         AND team_id = get_user_team_id(auth.uid())
       )
     );
   ```

### **Step 7: Update Package.json Dependencies**

Add the following to your `package.json`:

```json
{
  "dependencies": {
    "openai": "^4.28.0",
    "pdf-parse": "^1.1.1",
    "mammoth": "^1.6.0", 
    "xlsx": "^0.18.5",
    "marked": "^12.0.0",
    "puppeteer": "^21.9.0",
    "@mozilla/readability": "^0.4.4",
    "jsdom": "^24.0.0"
  },
  "devDependencies": {
    "@types/pdf-parse": "^1.1.4",
    "@types/jsdom": "^21.1.6"
  }
}
```

### **Step 8: Test the Implementation**

1. **Test Document Processing**:
   ```typescript
   // Upload a document and test processing
   const result = await fetch('/api/documents/process', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       documentId: 'your-document-id',
       fileName: 'test.pdf',
       fileUrl: 'document-url'
     })
   });
   ```

2. **Test Vector Search**:
   ```typescript
   // Test similarity search
   const searchResult = await fetch('/api/search/vector', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       query: 'test search query',
       limit: 5
     })
   });
   ```

3. **Test Internet Search**:
   ```typescript
   // Test internet search
   const internetResult = await fetch('/api/search/internet', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       query: 'latest AI developments',
       provider: 'google'
     })
   });
   ```

4. **Test PDF Generation**:
   ```typescript
   // Test PDF generation
   const pdfResult = await fetch('/api/pdf/generate', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       sessionId: 'your-session-id',
       prompt: 'Create a report about AI trends'
     })
   });
   ```

## 🔧 **Frontend Integration**

### **Enhanced Chat Interface**

Update your chat interface to include:

1. **Document Context Display**:
   ```tsx
   // Show relevant documents in chat
   const [contextDocuments, setContextDocuments] = useState([])
   
   // Fetch context when user types
   const handleUserMessage = async (message: string) => {
     const context = await vectorAPI.getChatContext(sessionId, message)
     setContextDocuments(context.results)
   }
   ```

2. **Internet Search Integration**:
   ```tsx
   // Add search button to chat interface
   const handleInternetSearch = async (query: string) => {
     const results = await internetSearchAPI.searchInternet(query)
     // Display results in chat
   }
   ```

3. **PDF Generation Button**:
   ```tsx
   // Add PDF generation option
   const handleGeneratePDF = async () => {
     const result = await pdfGenerationAPI.generatePDFFromPrompt(
       sessionId, prompt, options
     )
     // Handle download link
   }
   ```

### **Document Upload Enhancement**

1. **Auto-Processing Pipeline**:
   ```tsx
   const handleFileUpload = async (file: File) => {
     // 1. Upload to Supabase Storage
     const uploadResult = await uploadFile(file)
     
     // 2. Create document record
     const docResult = await createDocument(uploadResult.url)
     
     // 3. Auto-process for vector search
     await processDocumentForVectorSearch(docResult.id)
     
     // 4. Add to GPT context if needed
     if (gptId) {
       await addDocumentToGptContext(gptId, docResult.id)
     }
   }
   ```

## 📊 **Performance Optimization**

### **Vector Search Optimization**

1. **Index Configuration**:
   ```sql
   -- Optimize vector searches with proper indexing
   CREATE INDEX CONCURRENTLY idx_document_embeddings_vector 
   ON document_embeddings USING hnsw (embedding vector_cosine_ops);
   ```

2. **Query Optimization**:
   ```sql
   -- Use appropriate similarity thresholds
   SET enable_seqscan = OFF;  -- Force index usage for vector searches
   ```

3. **Batch Processing**:
   ```typescript
   // Process multiple documents in batches
   const processBatch = async (documents: Document[]) => {
     const batchSize = 5
     for (let i = 0; i < documents.length; i += batchSize) {
       const batch = documents.slice(i, i + batchSize)
       await Promise.all(batch.map(doc => processDocument(doc)))
     }
   }
   ```

### **Caching Strategy**

1. **Search Result Caching**:
   ```typescript
   // Cache frequent searches
   const searchCache = new Map()
   
   const cachedSearch = async (query: string) => {
     const cacheKey = `search:${query}`
     if (searchCache.has(cacheKey)) {
       return searchCache.get(cacheKey)
     }
     
     const result = await performSearch(query)
     searchCache.set(cacheKey, result)
     return result
   }
   ```

2. **Context Window Management**:
   ```typescript
   // Implement LRU cache for context windows
   const contextCache = new LRUCache({ max: 100 })
   ```

## 🛡️ **Security Considerations**

### **API Key Security**

1. **Environment Variable Validation**:
   ```typescript
   // Validate required environment variables on startup
   const requiredEnvVars = [
     'OPENAI_API_KEY',
     'NEXT_PUBLIC_SUPABASE_URL',
     'SUPABASE_SERVICE_ROLE_KEY'
   ]
   
   requiredEnvVars.forEach(varName => {
     if (!process.env[varName]) {
       throw new Error(`Missing required environment variable: ${varName}`)
     }
   })
   ```

2. **Rate Limiting**:
   ```typescript
   // Implement rate limiting for API calls
   const rateLimiter = {
     openai: new Map(),
     search: new Map()
   }
   ```

### **Data Privacy**

1. **Content Sanitization**:
   ```typescript
   // Sanitize document content before processing
   const sanitizeContent = (content: string) => {
     return content
       .replace(/[^\x20-\x7E\n]/g, '') // Remove non-printable characters
       .replace(/\b\d{4}-\d{4}-\d{4}-\d{4}\b/g, '[REDACTED]') // Credit cards
       .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[REDACTED]') // SSNs
   }
   ```

2. **Team Data Isolation**:
   ```typescript
   // Ensure RLS policies are enforced
   const enforceTeamAccess = async (userId: string, resourceTeamId: string) => {
     const user = await getUser(userId)
     if (user.role !== 'super_admin' && user.teamId !== resourceTeamId) {
       throw new Error('Access denied')
     }
   }
   ```

## 🔍 **Monitoring and Debugging**

### **Logging Setup**

1. **Vector Operation Logging**:
   ```typescript
   const logVectorOperation = (operation: string, metadata: any) => {
     console.log(`[VECTOR] ${operation}`, {
       timestamp: new Date().toISOString(),
       ...metadata
     })
   }
   ```

2. **Performance Monitoring**:
   ```typescript
   const monitorPerformance = async (operation: string, fn: Function) => {
     const start = Date.now()
     try {
       const result = await fn()
       const duration = Date.now() - start
       console.log(`[PERF] ${operation}: ${duration}ms`)
       return result
     } catch (error) {
       console.error(`[ERROR] ${operation}:`, error)
       throw error
     }
   }
   ```

### **Health Checks**

1. **Database Health**:
   ```typescript
   const checkDatabaseHealth = async () => {
     try {
       await supabase.from('users').select('count').single()
       return { status: 'healthy' }
     } catch (error) {
       return { status: 'unhealthy', error }
     }
   }
   ```

2. **Vector Search Health**:
   ```typescript
   const checkVectorSearchHealth = async () => {
     try {
       const testResult = await vectorAPI.searchSimilarDocuments('test query')
       return { status: 'healthy', searchWorking: testResult.success }
     } catch (error) {
       return { status: 'unhealthy', error }
     }
   }
   ```

## 🎉 **Next Steps**

After implementing the basic functionality:

1. **Advanced Features**:
   - Implement semantic chunking
   - Add multi-language support
   - Integrate with more AI models
   - Add advanced PDF templates

2. **UI Enhancements**:
   - Vector search visualization
   - Document relationship graphs
   - Interactive PDF preview
   - Real-time search suggestions

3. **Performance Improvements**:
   - Implement streaming for large documents
   - Add background job processing
   - Optimize vector index parameters
   - Add result caching layers

4. **Analytics and Insights**:
   - Usage analytics for vector searches
   - Document interaction tracking
   - Search quality metrics
   - Cost optimization insights

## 📚 **Additional Resources**

- [Supabase Vector Documentation](https://supabase.com/docs/guides/database/extensions/pgvector)
- [OpenAI Embeddings Guide](https://platform.openai.com/docs/guides/embeddings)
- [Vector Database Best Practices](https://www.pinecone.io/learn/vector-database/)
- [PDF Generation with Puppeteer](https://pptr.dev/)

---

**🚨 Important Notes:**

1. **Test thoroughly** in a development environment before deploying
2. **Monitor costs** for OpenAI API usage, especially embeddings
3. **Backup your database** before running migration scripts
4. **Review RLS policies** to ensure proper security
5. **Start with small document batches** to test performance

This implementation provides a solid foundation for vector-based document processing, AI context management, internet search, and PDF generation capabilities in your WFG GPT Clone project.