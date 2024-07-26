import React from "react";
import Start from "./components/Start";
import Quiz from "./components/Quiz";
import { DataProvider } from "./context/dataContext";

function App() {
  return (
    <DataProvider>
      {/* Welcome Page */}
      <Start />

      {/* Quiz Page */}
      <Quiz />
    </DataProvider>
  );
}

export default App;
