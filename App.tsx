
import React, { useState, useCallback } from 'react';
import { Step } from './components/Step';
import { steps } from './constants';
import { Chatbot } from './components/Chatbot';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => (prev > 0 ? prev - 1 : prev));
  }, []);

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-jetson-green" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.59L7.41 13H11v-2H5.59L4.29 9.71 5.71 8.29 8 10.59V4h2v6.59l2.29-2.29 1.42 1.42L11 12.41V14h5.59l-1.42 1.41 1.42 1.42L18.41 15H13v2h6.59l1.29 1.29-1.42 1.42-2.29-2.29V20h-2v-6.59z"/>
            </svg>
            <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">Jetson OS Cloner Guide</h1>
          </div>
          <p className="text-lg text-gray-400">Your interactive guide to migrating Jetson OS from SD Card to SSD.</p>
        </header>

        <main className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
          <div className="p-6 sm:p-8">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-jetson-green">Step {currentStep + 1} of {steps.length}</span>
                <span className="text-sm text-gray-400">{steps[currentStep].title}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-jetson-green h-2.5 rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${progressPercentage}%` }}>
                </div>
              </div>
            </div>

            <Step content={steps[currentStep]} />
          </div>
          
          <footer className="bg-gray-800/50 border-t border-gray-700 px-6 sm:px-8 py-4 flex justify-between items-center">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Previous
            </button>
            {currentStep < steps.length - 1 ? (
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-jetson-green text-jetson-gray font-bold rounded-lg shadow-md hover:bg-green-500 transition-colors duration-200"
              >
                Next Step
              </button>
            ) : (
                <span className="text-jetson-green font-bold">All Done! 🎉</span>
            )}
          </footer>
        </main>
        
        <p className="text-center text-xs text-gray-500 mt-8">
            Disclaimer: This is a guide and not an automated tool. Running these commands involves risk.
            Always double-check your drive identifiers. We are not responsible for any data loss.
        </p>
      </div>
      <Chatbot />
    </div>
  );
};

export default App;
