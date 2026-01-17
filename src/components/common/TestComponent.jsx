import { useEffect, useState } from 'react';

/**
 * Composant de test pour vérifier que tout fonctionne
 */
const TestComponent = () => {
  const [testResults, setTestResults] = useState([]);

  const addResult = (test, passed, message) => {
    setTestResults(prev => [...prev, { test, passed, message }]);
  };

  useEffect(() => {
    const runTests = async () => {
      // Test 1: Stores Zustand
      try {
        const { useAudioStore, useUserStore, useAIStore, useSessionStore } = await import('../../store');
        const audioState = useAudioStore.getState();
        const userState = useUserStore.getState();
        const aiState = useAIStore.getState();
        const sessionState = useSessionStore.getState();
        
        addResult('Stores Zustand', true, '4 stores chargés correctement');
      } catch (error) {
        addResult('Stores Zustand', false, error.message);
      }

      // Test 2: Services
      try {
        const { audioService, aiService } = await import('../../services');
        const audioServiceExists = typeof audioService.load === 'function';
        const aiServiceExists = typeof aiService.sendMessage === 'function';
        
        addResult('Services', audioServiceExists && aiServiceExists, 'audioService & aiService disponibles');
      } catch (error) {
        addResult('Services', false, error.message);
      }

      // Test 3: Sessions data
      try {
        const { useSessionStore } = await import('../../store');
        const sessions = useSessionStore.getState().sessions;
        addResult('Sessions Data', sessions.length > 0, `${sessions.length} séances chargées`);
      } catch (error) {
        addResult('Sessions Data', false, error.message);
      }

      // Test 4: OpenAI configuration
      try {
        const { aiService } = await import('../../services');
        const isConfigured = aiService.isConfigured();
        addResult('OpenAI API', isConfigured, isConfigured ? 'API key configurée' : 'API key manquante dans .env');
      } catch (error) {
        addResult('OpenAI API', false, error.message);
      }

      // Test 5: Howler.js
      try {
        const { Howl } = await import('howler');
        addResult('Howler.js', true, 'Librairie audio chargée');
      } catch (error) {
        addResult('Howler.js', false, error.message);
      }

      // Test 6: Web Speech API
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        addResult('Web Speech API', !!SpeechRecognition, SpeechRecognition ? 'Reconnaissance vocale supportée' : 'Non supporté par le navigateur');
      } catch (error) {
        addResult('Web Speech API', false, error.message);
      }

      // Test 7: MediaSession API
      try {
        const supported = 'mediaSession' in navigator;
        addResult('MediaSession API', supported, supported ? 'Contrôles lock screen disponibles' : 'Non supporté');
      } catch (error) {
        addResult('MediaSession API', false, error.message);
      }

      // Test 8: Filtres de séances
      try {
        const { useSessionStore } = await import('../../store');
        const sessionStore = useSessionStore.getState();
        sessionStore.updateFilter('discipline', 'Dressage');
        const filtered = sessionStore.getFilteredSessions();
        const allDressage = filtered.every(s => s.discipline === 'Dressage' || s.discipline === 'Transversal');
        addResult('Filtres séances', allDressage, `Filtrage fonctionne (${filtered.length} séances Dressage)`);
        sessionStore.resetFilters();
      } catch (error) {
        addResult('Filtres séances', false, error.message);
      }
    };

    runTests();
  }, []);

  const passedCount = testResults.filter(r => r.passed).length;
  const totalCount = testResults.length;
  const allPassed = passedCount === totalCount && totalCount > 0;

  return (
    <div className="fixed top-4 right-4 z-50 w-96 bg-white rounded-2xl shadow-2xl p-6 max-h-[80vh] overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-900">
        Tests Système 🧪
      </h2>
      
      <div className="mb-4">
        <div className={`text-lg font-semibold ${allPassed ? 'text-green-600' : 'text-orange-600'}`}>
          {passedCount}/{totalCount} tests réussis
        </div>
        {allPassed && totalCount > 0 && (
          <div className="text-sm text-green-700 mt-1">
            ✅ Tous les systèmes sont opérationnels!
          </div>
        )}
      </div>

      <div className="space-y-2">
        {testResults.map((result, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border ${
              result.passed
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-sm">
                {result.test}
              </span>
              <span className="text-xl">
                {result.passed ? '✅' : '❌'}
              </span>
            </div>
            <div className={`text-xs ${result.passed ? 'text-green-700' : 'text-red-700'}`}>
              {result.message}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={() => window.location.reload()}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Relancer les tests
        </button>
      </div>
    </div>
  );
};

export default TestComponent;
