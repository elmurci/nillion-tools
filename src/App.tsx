import Index from './components';
import NUCDecoder from './components/NUCDecoder';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/nuc-viewer" element={<NUCDecoder />} />
      </Routes>
    </Router>
  );
}

export default App;