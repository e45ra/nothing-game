import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Vibration, 
  Alert, 
  Dimensions,
  TouchableOpacityProps 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

type GameState = 'idle' | 'playing' | 'lost' | 'won';

export default function HomeScreen() {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            winGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const startGame = (): void => {
    setGameState('playing');
    setTimeLeft(10);
  };

  const handleTap = (): void => {
    if (gameState === 'playing') {
      loseGame();
    }
  };

  const loseGame = (): void => {
    Vibration.vibrate(500);
    setGameState('lost');
    Alert.alert('You Lost!', 'You tapped the screen!', [{ text: 'Try Again', onPress: resetGame }]);
  };

  const winGame = (): void => {
    Vibration.vibrate([100, 100, 100]);
    setGameState('won');
    setScore(prev => prev + 1);
    Alert.alert('You Won!', 'You avoided tapping for 10 seconds!', [{ text: 'Play Again', onPress: resetGame }]);
  };

  const resetGame = (): void => {
    setGameState('idle');
  };

  // Custom TouchableOpacity component with proper typing
  const GameButton: React.FC<TouchableOpacityProps & { title: string }> = ({ title, ...props }) => (
    <TouchableOpacity style={styles.startButton} {...props}>
      <Text style={styles.startButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handleTap}
      activeOpacity={1}
    >
      <LinearGradient
        colors={gameState === 'playing' ? ['#4c669f', '#3b5998', '#192f6a'] : gameState === 'lost' ? ['#ff6b6b', '#ff5252', '#ff3838'] : ['#4ecdc4', '#44a08d', '#0f9b0f']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.title}>
            {gameState === 'idle' ? 'DON\'T TAP ANYTHING' : 
             gameState === 'playing' ? 'DON\'T TAP!' : 
             gameState === 'lost' ? 'YOU TAPPED!' : 'YOU WON!'}
          </Text>
          
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>Time Remaining: {timeLeft}s</Text>
            <Text style={styles.infoText}>Score: {score}</Text>
          </View>

          <View style={styles.instructions}>
            {gameState === 'idle' && (
              <>
                <Text style={styles.instructionText}>Tap the START button to begin</Text>
                <Text style={styles.instructionText}>Then DON'T tap anywhere for 10 seconds</Text>
                <GameButton title="START" onPress={startGame} />
              </>
            )}
            
            {gameState === 'playing' && (
              <>
                <Text style={styles.warningText}>Whatever you do...</Text>
                <Text style={styles.warningText}>DON'T TAP THE SCREEN!</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, {width: `${(timeLeft/10)*100}%`}]} />
                </View>
              </>
            )}
            
            {gameState === 'lost' && (
              <>
                <Text style={styles.loseText}>You tapped! 😞</Text>
                <Text style={styles.instructionText}>Try to resist tapping next time</Text>
                <GameButton title="TRY AGAIN" onPress={resetGame} />
              </>
            )}
            
            {gameState === 'won' && (
              <>
                <Text style={styles.winText}>You won! 🎉</Text>
                <Text style={styles.instructionText}>You didn't tap for 10 seconds!</Text>
                <GameButton title="PLAY AGAIN" onPress={resetGame} />
              </>
            )}
          </View>
          
          <Text style={styles.footer}>The hardest game you'll ever play</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    height: height * 0.8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginVertical: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  infoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  infoText: {
    fontSize: 18,
    color: 'white',
    marginVertical: 5,
  },
  instructions: {
    alignItems: 'center',
    justifyContent: 'center',
    height: height * 0.4,
  },
  instructionText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginVertical: 10,
  },
  warningText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffcc00',
    textAlign: 'center',
    marginVertical: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  loseText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffcccc',
    textAlign: 'center',
    marginVertical: 10,
  },
  winText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ccffcc',
    textAlign: 'center',
    marginVertical: 10,
  },
  startButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 30,
    borderWidth: 2,
    borderColor: 'white',
  },
  startButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  progressBar: {
    width: width * 0.7,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
    marginTop: 30,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4ecdc4',
    borderRadius: 10,
  },
  footer: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 20,
    fontStyle: 'italic',
  },
});