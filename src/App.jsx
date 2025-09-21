import AppLayout from "./Components/AppLayout";


function App() {

  return (
    <AppLayout />
  )
}

const PORT = process.env.PORT || 3000;

App.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
})

export default App
