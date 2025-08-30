import { ScreenContent } from 'components/ScreenContent';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from '~/screens/HomeScreen';
import './global.css';

export default function App() {
  return (
    <>
      <HomeScreen />
      <StatusBar style="auto" />
    </>
  );
}
