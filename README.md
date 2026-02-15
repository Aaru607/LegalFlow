# 🚀 LegalFlow - Smart Task Management Engine

A production-ready task management application with **dependency enforcement** and **topological sorting** built with Next.js 14, TypeScript, MongoDB, and Clerk authentication.

## 📋 Project Overview

LegalFlow is a workflow engine that enforces strict task execution order. Tasks are automatically sorted using **Kahn's Algorithm** (Topological Sort), and the system prevents circular dependencies to avoid infinite loops.

### Key Features

- ✅ **Topological Sorting**: Tasks are automatically ordered based on dependencies
- 🔒 **Smart Locking**: Tasks lock automatically until dependencies are complete
- ⚠️ **Cycle Detection**: System prevents circular dependencies before they're created
- 🎨 **Modern UI**: Beautiful gradient-based design with shadcn/ui components
- 🔐 **Secure Authentication**: Clerk-powered user authentication
- 📱 **Responsive Design**: Mobile-friendly interface
- ⚡ **Real-time Updates**: Optimistic UI updates with Zustand state management

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | App Router, Server Actions, API Routes |
| **TypeScript** | Type safety and better developer experience |
| **MongoDB** | NoSQL database with Mongoose ODM |
| **Clerk** | Authentication and user management |
| **Zustand** | Lightweight state management |
| **Tailwind CSS** | Utility-first CSS framework |
| **shadcn/ui** | Re-usable UI components |
| **Lucide React** | Beautiful icon library |

## 📁 Project Structure

```
legalflow-engine/
├── app/
│   ├── api/
│   │   ├── tasks/
│   │   │   ├── route.ts              # GET & POST tasks
│   │   │   └── [id]/route.ts         # PATCH & DELETE task
│   │   └── dependency/
│   │       └── route.ts              # POST & DELETE dependency
│   ├── dashboard/
│   │   └── page.tsx                  # Main dashboard
│   ├── sign-in/
│   │   └── [[...sign-in]]/page.tsx  # Sign in page
│   ├── sign-up/
│   │   └── [[...sign-up]]/page.tsx  # Sign up page
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Landing page
│   └── globals.css                   # Global styles
├── components/
│   ├── ui/                           # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── checkbox.tsx
│   │   ├── select.tsx
│   │   ├── toast.tsx
│   │   └── toaster.tsx
│   ├── TaskCard.tsx                  # Task display component
│   ├── TaskCreator.tsx               # Task creation form
│   └── DependencyManager.tsx         # Dependency management
├── lib/
│   ├── dbConnect.ts                  # MongoDB connection
│   ├── topologicalSort.ts            # Kahn's Algorithm implementation
│   └── utils.ts                      # Utility functions
├── models/
│   ├── Task.ts                       # Task schema
│   └── Dependency.ts                 # Dependency schema
├── store/
│   └── taskStore.ts                  # Zustand store
├── hooks/
│   └── use-toast.ts                  # Toast hook
├── middleware.ts                     # Clerk auth middleware
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── .env.example
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or Atlas)
- Clerk account for authentication

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd legalflow-engine
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxx

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/legalflow?retryWrites=true&w=majority
```

### 4. Set Up Clerk

1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Copy your publishable key and secret key to `.env.local`
4. Configure allowed redirect URLs in Clerk dashboard

### 5. Set Up MongoDB

**Option A: MongoDB Atlas (Recommended)**
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Replace `<username>`, `<password>`, and `<cluster>` in the URI

**Option B: Local MongoDB**
```env
MONGODB_URI=mongodb://localhost:27017/legalflow
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🧪 Testing the Application

### 1. Create Tasks
- Sign up or sign in
- Create 4-5 tasks in random order (e.g., "Step 3", "Step 1", "Step 2")

### 2. Add Dependencies
- Create a dependency chain: Task A → Task B → Task C
- Refresh the page to see automatic sorting

### 3. Test Locking
- Try to complete Task C (should be locked)
- Complete Task A first
- Task B should unlock automatically

### 4. Test Cycle Detection
- Try to create: Task C → Task A (when A → B → C exists)
- System should show error: "⚠️ Cycle Detected!"

## 🧮 Kahn's Algorithm Explanation

The topological sort is implemented in `lib/topologicalSort.ts`:

```typescript
// Build graph and calculate in-degrees
const graph = new Map<string, string[]>();
const inDegree = new Map<string, number>();

// Start with nodes that have no dependencies (in-degree = 0)
const queue: string[] = [];

// Process queue and reduce in-degrees
while (queue.length > 0) {
  const currentId = queue.shift()!;
  // ... processing logic
}

// If not all tasks processed = cycle detected
const hasCycle = sortedTaskIds.length !== tasks.length;
```

### Key Functions

1. **`topologicalSort()`**: Sorts tasks using Kahn's Algorithm
2. **`wouldCreateCycle()`**: Detects cycles before creating dependencies
3. **`isTaskUnlocked()`**: Checks if all dependencies are complete

## 📦 Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Add environment variables from `.env.local`
4. Click Deploy

### 3. Update Clerk URLs

Update your Clerk dashboard with your Vercel domain:
- `https://your-app.vercel.app/sign-in`
- `https://your-app.vercel.app/sign-up`
- `https://your-app.vercel.app/dashboard`

## 🎨 UI Features

### Gradient Design
- Purple to blue gradients throughout the interface
- Hover effects and smooth transitions
- Responsive grid layout

### Status Indicators
- 🔒 **Locked**: Gray background, lock icon
- ⏳ **Pending**: Yellow badge
- ✅ **Completed**: Green badge with checkmark

### Toast Notifications
- Success: Green toast for completed actions
- Error: Red toast with descriptive messages
- Cycle Detection: Warning toast for circular dependencies

## 🐛 Common Issues & Solutions

### MongoDB Connection Error
```
Error: Could not connect to MongoDB
```
**Solution**: Check your MONGODB_URI is correct and your IP is whitelisted in MongoDB Atlas

### Clerk Authentication Error
```
Error: Clerk publishable key not found
```
**Solution**: Make sure all Clerk environment variables are set in `.env.local`

### Build Errors
```
Error: Module not found
```
**Solution**: Delete `node_modules` and `.next`, then run `npm install`

## 📝 API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks (sorted)
- `POST /api/tasks` - Create new task
- `PATCH /api/tasks/[id]` - Update task (toggle completion)
- `DELETE /api/tasks/[id]` - Delete task

### Dependencies
- `POST /api/dependency` - Create dependency
- `DELETE /api/dependency?id=[id]` - Delete dependency


