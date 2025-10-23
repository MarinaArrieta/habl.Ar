import AppLayout from "./components/AppLayout";
import { UserProvider } from "./context/UserContext";

function App() {
  return (

    <UserProvider>
      <AppLayout />
    </UserProvider>

  );
}

export default App;
