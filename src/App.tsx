import { ApiProvider, useApi } from './contexts/ApiContext';
import { ChatContainer } from './components/ChatContainer';
import { ModelSelector } from './components/ModelSelector';
import './styles/chat.css';

// ローディングコンポーネント
const LoadingScreen = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      <p className="mt-4 text-lg">APIクライアントを初期化中です...</p>
    </div>
  </div>
);

// エラー画面コンポーネント
const ErrorScreen = ({ error }: { error: string }) => (
  <div className="flex items-center justify-center h-screen">
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md">
      <strong className="font-bold">初期化エラー:</strong>
      <span className="block sm:inline ml-2">{error}</span>
    </div>
  </div>
);

// メインアプリケーションコンポーネント
const AppContent = () => {
  const { isInitializing, error } = useApi();

  if (isInitializing) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen error={error} />;
  }

  return (
    <>
      <ModelSelector />
      <ChatContainer />
    </>
  );
};

function App() {
  return (
    <ApiProvider>
      <AppContent />
    </ApiProvider>
  );
}

export default App;
