import './App.css';
import {LanguageProvider} from "./components/LanguageContext";
import {PatientProvider} from "./components/PatientContext";
import { ProblemProvider } from './components/ProblemContext';
import  {Home} from './components/Home';

function App() {
  return (
    <LanguageProvider >
        <PatientProvider>
          <ProblemProvider>
            <Home />
          </ProblemProvider>
        </PatientProvider>
    </LanguageProvider>
  )
}

export default App;
