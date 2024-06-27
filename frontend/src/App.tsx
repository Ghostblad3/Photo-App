import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./Layout.tsx";
import TestComponent from "./test-view/TestComponent.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Disable refetch on window focus
      refetchOnReconnect: false, // Disable refetch on network reconnect
      refetchInterval: false, // Disable automatic refetch interval
    },
  },
});

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Layout />
        {/* <TestComponent /> */}
      </QueryClientProvider>
    </>
  );
}

export default App;
