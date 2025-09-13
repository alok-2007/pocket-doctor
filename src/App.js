import './App.css';
import {LanguageProvider} from "./components/LanguageContext";
import {PatientProvider} from "./components/PatientContext";

function App() {
  return (
    <LanguageProvider >
      <PatientProvider>

      </PatientProvider>
    </LanguageProvider>
  )
}

export default App;
