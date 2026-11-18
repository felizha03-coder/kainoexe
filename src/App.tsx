import React from 'react';
import { TopHud } from './components/TopHud';
import { KainoProvider, useKaino } from './context/KainoContext';
import { BootScreen } from './screens/BootScreen';
import { CardsCollectionScreen } from './screens/CardsCollectionScreen';
import { FinalLoveScreen } from './screens/FinalLoveScreen';
import { LoveArcadeScreen } from './screens/LoveArcadeScreen';
import { LoveLettersScreen } from './screens/LoveLettersScreen';
import { SecretRoomScreen } from './screens/SecretRoomScreen';
import { TitleScreen } from './screens/TitleScreen';
import { WorldHubScreen } from './screens/WorldHubScreen';

const KainoUniverseRouter: React.FC = () => {
  const { screen } = useKaino();

  const renderScreen = () => {
    switch (screen) {
      case 'BOOT':
        return <BootScreen />;
      case 'TITLE':
        return <TitleScreen />;
      case 'WORLD':
        return <WorldHubScreen />;
      case 'LETTERS':
        return <LoveLettersScreen />;
      case 'CARDS':
        return <CardsCollectionScreen />;
      case 'ARCADE':
        return <LoveArcadeScreen />;
      case 'SECRET_ROOM':
        return <SecretRoomScreen />;
      case 'FINAL_LOVE':
        return <FinalLoveScreen />;
      default:
        return <TitleScreen />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFE8F3]">
      <TopHud />
      <div className="flex-1">{renderScreen()}</div>
    </div>
  );
};

export function App() {
  return (
    <KainoProvider>
      <KainoUniverseRouter />
    </KainoProvider>
  );
}

export default App;
