'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import Form from "@/fragments/formRenderer";
import { useState } from 'react';
import { Toaster } from 'sonner';

export default function Home() {

  const [queryClient] = useState(() => new QueryClient());

  return (
    <div className="flex items-center justify-center h-full w-full">
      <Form />
      <Toaster position="top-right" expand={false} />
    </div>
  );
}
