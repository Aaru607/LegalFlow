# 📁 File Structure Guide

This document explains the purpose of every file and folder in the LegalFlow project.

## 🌳 Complete Project Tree

```
legalflow-engine/
│
├── 📁 app/                          # Next.js 14 App Router
│   ├── 📁 api/                      # Backend API Routes
│   │   ├── 📁 tasks/
│   │   │   ├── route.ts             # GET: Fetch sorted tasks | POST: Create task
│   │   │   └── 📁 [id]/
│   │   │       └── route.ts         # PATCH: Update task | DELETE: Delete task
│   │   └── 📁 dependency/
│   │       └── route.ts             # POST: Create dependency | DELETE: Remove dependency
│   │
│   ├── 📁 dashboard/
│   │   └── page.tsx                 # 🏠 Main Dashboard (Protected Route)
│   │
│   ├── 📁 sign-in/
│   │   └── 📁 [[...sign-in]]/
│   │       └── page.tsx             # 🔐 Sign In Page (Clerk)
│   │
│   ├── 📁 sign-up/
│   │   └── 📁 [[...sign-up]]/
│   │       └── page.tsx             # 📝 Sign Up Page (Clerk)
│   │
│   ├── layout.tsx                   # Root Layout (Clerk Provider)
│   ├── page.tsx                     # 🌐 Landing Page
│   └── globals.css                  # Global Styles + Gradient Classes
│
├── 📁 components/                   # React Components
│   ├── 📁 ui/                       # shadcn/ui Components
│   │   ├── button.tsx               # Reusable Button Component
│   │   ├── checkbox.tsx             # Checkbox Component
│   │   ├── input.tsx                # Input Field Component
│   │   ├── select.tsx               # Dropdown Select Component
│   │   ├── toast.tsx                # Toast Notification Component
│   │   └── toaster.tsx              # Toast Provider Wrapper
│   │
│   ├── TaskCard.tsx                 # 📋 Individual Task Display
│   ├── TaskCreator.tsx              # ➕ Task Creation Form
│   └── DependencyManager.tsx        # 🔗 Dependency Management UI
│
├── 📁 lib/                          # Utility Functions
│   ├── dbConnect.ts                 # 🗄️ MongoDB Connection (Cached)
│   ├── topologicalSort.ts           # 🧮 Kahn's Algorithm Implementation
│   ├── utils.ts                     # cn() Class Name Utility
│   └── mongodb.d.ts                 # TypeScript Declarations
│
├── 📁 models/                       # Database Models
│   ├── Task.ts                      # Task Schema (Mongoose)
│   └── Dependency.ts                # Dependency Schema (Mongoose)
│
├── 📁 store/                        # State Management
│   └── taskStore.ts                 # 🏪 Zustand Store (Global State)
│
├── 📁 hooks/                        # Custom React Hooks
│   └── use-toast.ts                 # Toast Notification Hook
│
├── 📄 Configuration Files
│   ├── middleware.ts                # 🔐 Clerk Auth Middleware
│   ├── package.json                 # Dependencies & Scripts
│   ├── tsconfig.json                # TypeScript Configuration
│   ├── tailwind.config.ts           # Tailwind CSS Configuration
│   ├── postcss.config.js            # PostCSS Configuration
│   ├── next.config.js               # Next.js Configuration
│   ├── .env.example                 # Environment Variables Template
│   └── .gitignore                   # Git Ignore Rules
│
└── 📚 Documentation Files
    ├── README.md                    # Main Project Documentation
    ├── QUICKSTART.md                # 5-Minute Setup Guide
    ├── DEPLOYMENT.md                # Vercel Deployment Guide
    ├── DEMO_SCRIPT.md               # Video Recording Script
    ├── SUBMISSION.md                # How to Submit
    └── PROJECT_OVERVIEW.md          # Technical Deep Dive
```

---

## 📖 File Purposes Explained

### 🎯 Core Application Files

#### `app/page.tsx` - Landing Page
- Beautiful gradient hero section
- Feature showcase
- CTA buttons for sign up
- Responsive design

#### `app/dashboard/page.tsx` - Main Dashboard
- Task list with auto-sorting
- Task creation interface
- Dependency management
- Loading states & error handling
- **Most complex component in the app**

#### `middleware.ts` - Route Protection
```typescript
// Protects all routes except public ones
export default authMiddleware({
  publicRoutes: ["/", "/sign-in", "/sign-up"],
});
```

---

### 🔧 API Routes

#### `app/api/tasks/route.ts`
**GET**: Fetches tasks, sorts using Kahn's Algorithm
```typescript
const { sortedTasks, hasCycle } = topologicalSort(tasks, dependencies);
```

**POST**: Creates new task with validation
```typescript
if (!name || name.trim().length === 0) {
  return error;
}
```

#### `app/api/tasks/[id]/route.ts`
**PATCH**: Updates task completion status
- Checks if task is unlocked before allowing completion
- Updates MongoDB
- Returns updated task

**DELETE**: Deletes task
- Checks for active dependencies first
- Prevents deletion if dependencies exist

#### `app/api/dependency/route.ts`
**POST**: Creates dependency
- **CRITICAL**: Runs cycle detection BEFORE database write
```typescript
if (wouldCreateCycle(allDependencies, providerId, dependentId)) {
  return error("Cycle Detected!");
}
```

**DELETE**: Removes dependency
- Simple deletion
- Triggers re-sort on frontend

---

### 🧮 Algorithm Implementation

#### `lib/topologicalSort.ts` - The Brain of the App

**Key Functions:**

1. **`topologicalSort(tasks, dependencies)`**
   - Implements Kahn's Algorithm (BFS)
   - Returns sorted tasks in execution order
   - Detects cycles if present
   - **This is what you'll explain in your demo video**

2. **`wouldCreateCycle(dependencies, newProvider, newDependent)`**
   - Pre-validation before creating dependency
   - Uses DFS with recursion stack
   - Prevents invalid dependencies from entering database

3. **`isTaskUnlocked(taskId, tasks, dependencies)`**
   - Checks if all provider tasks are completed
   - Returns boolean for UI rendering
   - Used to show/hide lock icons

**Example Usage:**
```typescript
// In API route
const { sortedTasks, hasCycle } = topologicalSort(tasks, dependencies);

if (hasCycle) {
  return error("Dependency cycle detected");
}

// Add lock status to each task
const tasksWithLockStatus = sortedTasks.map(task => ({
  ...task,
  isLocked: !isTaskUnlocked(task._id, tasks, dependencies)
}));
```

---

### 🗄️ Database Layer

#### `lib/dbConnect.ts` - MongoDB Connection
- Caches connection across hot reloads
- Prevents connection pool exhaustion
- Production-ready pattern
```typescript
// Connection is cached globally
let cached = global.mongoose;
```

#### `models/Task.ts` - Task Schema
```typescript
{
  userId: string,      // For data isolation
  name: string,        // Task description
  completed: boolean,  // Status
  createdAt: Date,
  updatedAt: Date
}
```

#### `models/Dependency.ts` - Dependency Schema
```typescript
{
  userId: string,
  providerId: string,   // Task that must complete first
  dependentId: string,  // Task that depends on provider
  createdAt: Date
}
```

**Important**: Unique compound index prevents duplicate dependencies:
```typescript
DependencySchema.index({ userId: 1, providerId: 1, dependentId: 1 }, { unique: true });
```

---

### 🏪 State Management

#### `store/taskStore.ts` - Zustand Store
All client-side state lives here:
```typescript
interface TaskStore {
  // State
  tasks: Task[];
  dependencies: Dependency[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchTasks: () => Promise<void>;
  createTask: (name: string) => Promise<void>;
  toggleTask: (id: string, completed: boolean) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  createDependency: (provider: string, dependent: string) => Promise<void>;
  deleteDependency: (id: string) => Promise<void>;
}
```

**Why Zustand?**
- Lightweight (1kb)
- No Context API boilerplate
- TypeScript-friendly
- Simple API
- Perfect for this use case

---

### 🎨 UI Components

#### `components/TaskCard.tsx`
- Displays individual task
- Shows lock icon if dependencies incomplete
- Status badge (Pending/Completed/Locked)
- Hover effects
- Delete button
- Gradient accents

#### `components/TaskCreator.tsx`
- Text input for task name
- Validation
- Submit button with gradient
- Toast notifications

#### `components/DependencyManager.tsx`
- Two dropdown selects (provider + dependent)
- Create dependency button
- List of existing dependencies
- Delete dependency functionality
- Gradient styling

#### `components/ui/*` - shadcn/ui Components
Pre-built, customizable components:
- Consistent styling
- Accessibility built-in
- Radix UI primitives
- Tailwind CSS styling

---

### 📝 Configuration Files

#### `package.json`
Dependencies:
- `next` - Framework
- `react` - UI library
- `typescript` - Type safety
- `mongoose` - MongoDB ODM
- `@clerk/nextjs` - Authentication
- `zustand` - State management
- `tailwindcss` - Styling
- `lucide-react` - Icons

#### `tsconfig.json`
- Strict mode enabled
- Path aliases (`@/*`)
- ES2017 target

#### `tailwind.config.ts`
- Custom gradient utilities
- shadcn/ui theming
- Responsive breakpoints

#### `.env.example`
Template for environment variables:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
MONGODB_URI=
```

---

## 🗂️ How Files Work Together

### User Creates a Task

```
User clicks "Add Task"
    ↓
TaskCreator.tsx calls store.createTask()
    ↓
Zustand Store sends POST to /api/tasks
    ↓
API validates input, saves to MongoDB
    ↓
API calls topologicalSort.ts
    ↓
Returns sorted tasks with lock status
    ↓
Zustand Store updates state
    ↓
TaskCard.tsx re-renders with new data
```

### User Creates a Dependency

```
User selects two tasks in DependencyManager.tsx
    ↓
Calls store.createDependency()
    ↓
POST to /api/dependency
    ↓
API calls wouldCreateCycle() FIRST
    ↓
If cycle detected → return error
    ↓
If valid → save to MongoDB
    ↓
Refetch all tasks (triggers topologicalSort)
    ↓
UI updates with new sort order
```

---

## 🎯 Key Takeaways

### Most Important Files

1. **`lib/topologicalSort.ts`** - Your algorithm implementation (demo this!)
2. **`app/api/dependency/route.ts`** - Cycle detection before writes
3. **`app/dashboard/page.tsx`** - Main UI orchestration
4. **`store/taskStore.ts`** - State management logic

### Files to Focus On for Demo

When recording your video, spend time on:
- `topologicalSort.ts` - Show the Kahn's Algorithm
- `wouldCreateCycle()` - Explain cycle detection
- `app/dashboard/page.tsx` - Show the complete UI
- `TaskCard.tsx` - Point out locked state logic

---

## 🚀 Development Workflow

```
1. Make changes to files
2. Next.js hot-reloads automatically
3. Check browser for updates
4. Check console for errors
5. Test features thoroughly
6. Commit when working
```

---

**Questions about any file?**  
Check the comments in the actual file or refer to README.md!
