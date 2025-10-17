import Index from './components';
import NUCDecoder from './components/NUCDecoder';
// import ThresholdSecretSharer from './components/ThresholdSecretSharer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/nuc-viewer" element={<NUCDecoder />} />
        {/* <Route path="/threshold-secret-sharer" element={<ThresholdSecretSharer />} /> */}
      </Routes>
    </Router>
  );
}

export default App;