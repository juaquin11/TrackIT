import React from 'react';
import { Header } from './components/Header';
import { DailySummary } from './components/DailySummary';
import { FoodList } from './components/FoodList';

export const App: React.FC = () => {
  return (
    <div className="app-container">
      <Header />
      <main>
        <DailySummary />
        <FoodList />
      </main>
    </div>
  );
};

export default App;
