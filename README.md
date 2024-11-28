# Royal Class - Dynamic Form Rendering

## Description

This is a Next.js project that demonstrates the usage of various modern frontend libraries and tools including `ShadCN UI`, `TanStack Query`, `React Hook Form`, and `Framer Motion`. It integrates functionalities like form handling, data fetching, and UI transitions to provide an interactive and user-friendly experience. The project also includes toast notifications and form validation using `zod`.

### Features

- **Data Fetching and Mutation** using TanStack Query (`useQuery`, `useMutation`)
- **UI Components** from `ShadCN UI`
- **Form Validation** with `zod` and `react-hook-form`
- **Smooth UI Animations** powered by `Framer Motion`
- **Toast Notifications** with `sonner`
- **Icons** from `Lucide React`

---

## Installation and Setup

### Prerequisites

Ensure you have the following installed:

- Node.js (v14 or higher)
- npm or yarn (for managing dependencies)

### 1. Clone the repository

```bash
git clone https://github.com/emmanuel-martin/dynamic-form-rendering-royal-class-test.git
> **WARNING**: use npm install --legacy-peer-deps

### 2. Install Dependencies (use --legacy-peer-deps)
```bash
npm install --legacy-peer-deps
# or
yarn install --legacy-peer-deps
```

### 3. Install Specific Libraries
```bash
# Shadcn UI
npx shadcn-ui@latest init

# Tanstack Query
npm install @tanstack/react-query

# React Hook Form
npm install react-hook-form @hookform/resolvers

# Zod
npm install zod

# Sonner (Toasts)
npm install sonner

# Lucide React (Icons)
npm install lucide-react

# Framer Motion
npm install framer-motion
```

## 🔧 Configuration

### Shadcn UI Initialization
```bash
npx shadcn-ui@latest init
```
- Follow the prompts to configure your project

### Tanstack Query Setup
```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  )
}
```

## 📝 Key Libraries Usage Examples

### Tanstack Query (useMutation)
```typescript
const mutation = useMutation({
  mutationFn: yourApiCall,
  onSuccess: () => {
    toast.success('Operation Successful')
  },
  onError: () => {
    toast.error('Operation Failed')
  }
})
```

### Zod Validation
```typescript
const formSchema = z.object({
  username: z.string().min(2, { message: "Username too short" }),
  email: z.string().email({ message: "Invalid email" })
})
```

### React Hook Form with Zod
```typescript
const form = useForm({
  resolver: zodResolver(formSchema)
})
```

## 🚦 Running the Project

### Development Mode
```bash
npm run dev
# or
yarn dev
```

### Production Build
```bash
npm run build
npm run start
# or
yarn build
yarn start
```


## 📂 Project Structure
```
/
├── components/
├── app/
├── fragments/
├── lib/
├── pages/
```

## 📄 License
Distributed under the MIT License.

## 📞 Contact
Emmanuel Martin - mail@emmanuell.co

Project Link: [https://github.com/emmanuel-martin/dynamic-form-rendering-royal-class-test.git](https://github.com/emmanuel-martin/dynamic-form-rendering-royal-class-test.git)
