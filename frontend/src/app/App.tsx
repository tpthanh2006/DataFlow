import { AppProvider } from "./Provider";
import { Router } from "./Router";

function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}

export default App;
