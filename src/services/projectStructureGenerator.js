


export const generateGithubStructure = (project) => {
  const { domain, tech_stack = [], title } = project;
  
  
  const hasReact = tech_stack.some(t => t.toLowerCase().includes('react'));
  const hasNode = tech_stack.some(t => t.toLowerCase().includes('node'));
  const hasNext = tech_stack.some(t => t.toLowerCase().includes('next'));
  const hasPython = tech_stack.some(t => t.toLowerCase().includes('python'));
  const hasFlutter = tech_stack.some(t => t.toLowerCase().includes('flutter'));
  const hasReactNative = tech_stack.some(t => t.toLowerCase().includes('react native'));
  const hasBlockchain = domain === 'Blockchain' || tech_stack.some(t => t.toLowerCase().includes('solidity'));
  
  let structure = '';
  
  if (hasNext) {
    structure = `project-root/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   ├── api/
│   │   └── route.ts
│   └── (routes)/
│       ├── dashboard/
│       └── profile/
├── components/
│   ├── ui/
│   ├── forms/
│   └── layout/
├── lib/
│   ├── utils.ts
│   └── api/
├── public/
│   ├── images/
│   └── icons/
├── styles/
├── types/
├── .env.local
├── next.config.js
├── package.json
├── tailwind.config.js
└── tsconfig.json`;
  } else if (hasReact && hasNode) {
    structure = `project-root/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── index.js
│   ├── package.json
│   └── .env
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── utils/
│   ├── server.js
│   ├── package.json
│   └── .env
├── .gitignore
└── README.md`;
  } else if (hasReact) {
    structure = `project-root/
├── public/
│   ├── index.html
│   └── assets/
├── src/
│   ├── components/
│   │   ├── common/
│   │   └── features/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   ├── utils/
│   ├── store/
│   ├── styles/
│   ├── App.jsx
│   └── index.js
├── .env
├── package.json
├── tailwind.config.js
└── vite.config.js`;
  } else if (hasReactNative || hasFlutter) {
    structure = `project-root/
├── android/
├── ios/
├── src/
│   ├── components/
│   ├── screens/
│   ├── navigation/
│   ├── services/
│   ├── utils/
│   ├── assets/
│   └── App.${hasFlutter ? 'dart' : 'js'}
├── app.json
├── package.json
└── README.md`;
  } else if (hasBlockchain) {
    structure = `project-root/
├── contracts/
│   ├── Token.sol
│   ├── Governance.sol
│   └── Migrations.sol
├── migrations/
│   └── 1_initial_migration.js
├── test/
│   └── token.test.js
├── scripts/
│   ├── deploy.js
│   └── interact.js
├── client/
│   ├── src/
│   └── public/
├── truffle-config.js
├── hardhat.config.js
└── package.json`;
  } else if (hasPython) {
    structure = `project-root/
├── src/
│   ├── __init__.py
│   ├── main.py
│   ├── models/
│   ├── services/
│   ├── utils/
│   └── config/
├── tests/
│   └── test_main.py
├── data/
├── notebooks/
├── requirements.txt
├── setup.py
├── .env
└── README.md`;
  } else {
    
    structure = `project-root/
├── src/
│   ├── components/
│   ├── services/
│   ├── utils/
│   └── index.js
├── tests/
├── public/
├── config/
├── .env
├── package.json
└── README.md`;
  }
  
  return structure;
};


export const generateArchitecture = (project) => {
  const { domain, complexity, tech_stack = [] } = project;
  
  const hasReact = tech_stack.some(t => t.toLowerCase().includes('react'));
  const hasNode = tech_stack.some(t => t.toLowerCase().includes('node'));
  const hasDatabase = tech_stack.some(t => ['postgresql', 'mongodb', 'mysql', 'redis'].some(db => t.toLowerCase().includes(db)));
  const hasAI = domain === 'AI/ML' || tech_stack.some(t => ['gemini', 'openai', 'tensorflow'].some(ai => t.toLowerCase().includes(ai)));
  
  let architecture = '';
  
  if (hasReact && hasNode && hasDatabase) {
    architecture = `Full-stack architecture with:

**Frontend Layer:**
- React-based SPA with component-driven architecture
- State management with Context API/Redux
- Responsive UI with TailwindCSS
- Client-side routing

**Backend Layer:**
- RESTful API with Node.js/Express
- JWT authentication & authorization
- Input validation & error handling
- Rate limiting & security middleware

**Database Layer:**
- ${tech_stack.find(t => t.toLowerCase().includes('postgre')) ? 'PostgreSQL' : 'MongoDB'} for data persistence
- ${tech_stack.find(t => t.toLowerCase().includes('redis')) ? 'Redis for caching & session management' : 'Optimized queries with indexing'}
- Data validation & sanitization

${hasAI ? `**AI Integration:**
- AI API integration for intelligent features
- Prompt engineering & response handling
- Error handling & fallback mechanisms` : ''}

**DevOps:**
- Docker containerization
- CI/CD pipeline
- Environment-based configuration`;
  } else if (hasReact) {
    architecture = `Single Page Application (SPA) architecture:

**Component Layer:**
- Reusable functional components
- Custom hooks for business logic
- Component composition patterns

**State Management:**
- React Context API for global state
- Local state with useState/useReducer
- Side effects with useEffect

**Routing:**
- Client-side routing with React Router
- Protected routes & authentication guards
- Lazy loading for code splitting

**API Communication:**
- Axios/Fetch for HTTP requests
- API service layer abstraction
- Error handling & loading states`;
  } else if (domain === 'Blockchain') {
    architecture = `Decentralized application (dApp) architecture:

**Smart Contract Layer:**
- Solidity smart contracts on Ethereum/polygon
- Contract upgradability patterns
- Events & logging

**Web3 Layer:**
- Web3.js/Ethers.js integration
- Wallet connection (MetaMask, WalletConnect)
- Transaction signing & verification

**Frontend Layer:**
- React dApp interface
- Web3 provider context
- Real-time blockchain state updates

**Storage:**
- IPFS for decentralized storage
- On-chain data minimization
- Off-chain indexing`;
  } else if (domain === 'Mobile Development') {
    architecture = `Mobile application architecture:

**Presentation Layer:**
- Screen components with navigation
- Reusable UI components
- Platform-specific code handling

**Business Logic Layer:**
- Service classes for API calls
- State management
- Local data caching

**Data Layer:**
- Local storage (AsyncStorage/SQLite)
- API integration
- Offline-first approach

**Native Modules:**
- Camera, GPS, sensors integration
- Push notifications
- Background tasks`;
  } else if (domain === 'AI/ML') {
    architecture = `AI-powered application architecture:

**Frontend Layer:**
- Interactive user interface
- Real-time AI responses
- Loading & error states

**API Layer:**
- AI service integration (Gemini/OpenAI)
- Prompt engineering
- Response parsing & validation

**Processing Layer:**
- Input preprocessing
- Context management
- Response caching

**Data Layer:**
- User interaction logging
- Conversation history
- Analytics & insights`;
  } else {
    architecture = `Modular application architecture:

**Presentation Layer:**
- User interface components
- Responsive design
- Accessibility features

**Business Logic Layer:**
- Core application logic
- Service classes
- Utility functions

**Data Layer:**
- Data persistence
- API communication
- State management

**Infrastructure:**
- Configuration management
- Error handling & logging
- Testing framework`;
  }
  
  return architecture;
};


export const generateDeploymentGuide = (project) => {
  const { tech_stack = [] } = project;
  
  const hasReact = tech_stack.some(t => t.toLowerCase().includes('react'));
  const hasNode = tech_stack.some(t => t.toLowerCase().includes('node'));
  const hasNext = tech_stack.some(t => t.toLowerCase().includes('next'));
  const hasVercel = tech_stack.some(t => t.toLowerCase().includes('vercel'));
  const hasDocker = tech_stack.some(t => t.toLowerCase().includes('docker'));
  
  let guide = '';
  
  if (hasNext || hasVercel) {
    guide = `**Vercel Deployment (Recommended):**

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy with automatic CI/CD

**Manual Deployment:**

1. Build the project:
   npm run build

2. Start production server:
   npm start

**Environment Variables:**
- Create .env.local with required API keys
- Add environment variables to Vercel dashboard
- Never commit .env files to version control

**Domain Configuration:**
- Add custom domain in Vercel settings
- Configure DNS records
- Enable automatic HTTPS`;
  } else if (hasReact && hasNode) {
    guide = `**Frontend Deployment (Vercel/Netlify):**

1. Build client:
   cd client && npm run build

2. Deploy build folder to hosting platform

**Backend Deployment (Railway/Render/AWS):**

1. Set environment variables
2. Deploy server code
3. Configure database connection

**Database Setup:**
- Create production database instance
- Run migrations
- Configure connection string

**Full Stack Deployment:**

1. Deploy backend API first
2. Update frontend API URLs
3. Deploy frontend
4. Test end-to-end functionality

**Docker Deployment (Optional):**

docker-compose up -d`;
  } else if (hasDocker) {
    guide = `**Docker Deployment:**

1. Build Docker image:
   docker build -t project-name .

2. Run container:
   docker run -p 8080:8080 -d project-name

**Docker Compose:**

docker-compose up -d

**Environment Configuration:**
- Use docker-compose.yml for local development
- Use docker-compose.prod.yml for production
- Mount volumes for persistent data

**Cloud Deployment:**
- Push image to Docker Hub/AWS ECR
- Deploy to Kubernetes/ECS/Cloud Run
- Configure load balancer & auto-scaling`;
  } else if (hasReact) {
    guide = `**Static Site Deployment:**

1. Build production bundle:
   npm run build

2. Deploy to hosting platform:
   - Vercel: vercel deploy
   - Netlify: netlify deploy
   - GitHub Pages: npm run deploy

**Environment Variables:**
- Create .env.production file
- Add REACT_APP_ prefix to variables
- Rebuild after environment changes

**CDN Configuration:**
- Enable gzip compression
- Configure caching headers
- Optimize asset delivery`;
  } else {
    guide = `**General Deployment Steps:**

1. Prepare Production Build:
   - Install dependencies
   - Run tests
   - Build production bundle

2. Server Configuration:
   - Set environment variables
   - Configure database connections
   - Set up reverse proxy (Nginx)

3. Deploy Application:
   - Upload files to server
   - Start application service
   - Configure process manager (PM2)

4. Post-Deployment:
   - Verify functionality
   - Monitor logs
   - Set up health checks

**Monitoring:**
- Configure error tracking
- Set up performance monitoring
- Enable automatic alerts`;
  }
  
  return guide;
};


export const enrichProjectWithStructure = (project) => {
  if (!project) return project;
  
  return {
    ...project,
    github_structure: project.github_structure || generateGithubStructure(project),
    architecture: project.architecture || generateArchitecture(project),
    deployment_guide: project.deployment_guide || generateDeploymentGuide(project)
  };
};
