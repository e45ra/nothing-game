import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Vibration,
  Alert,
  Dimensions,
  Animated,
  Easing
} from 'react-native';

const { width, height } = Dimensions.get('window');

type GameState = 'idle' | 'playing' | 'lost' | 'won';

export default function HomeScreen() {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const [score, setScore] = useState<number>(0);
  const [round, setRound] = useState<number>(1);
  const [targetTime, setTargetTime] = useState<number>(10);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 0.1) {
            winGame();
            return 0;
          }
          return parseFloat((prev - 0.1).toFixed(1));
        });
      }, 100);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameState, timeLeft]);

  useEffect(() => {
    if (gameState === 'playing') {
      // Animate progress bar
      Animated.timing(progressAnim, {
        toValue: (targetTime - timeLeft) / targetTime,
        duration: 100,
        useNativeDriver: false,
      }).start();
      
      // Pulsing animation effect
      if (timeLeft < 3) {
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.1,
              duration: 300,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 300,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ])
        ).start();
      } else {
        pulseAnim.setValue(1);
      }
    }
  }, [timeLeft, gameState]);

  const startGame = (): void => {
    setGameState('playing');
    setTimeLeft(targetTime);
    progressAnim.setValue(0);
  };

  const handleTap = (): void => {
    if (gameState === 'playing') {
      loseGame();
    }
  };

  const loseGame = (): void => {
    Vibration.vibrate(300);
    setGameState('lost');
    Alert.alert(
      'Game Over', 
      `You tapped after ${(targetTime - timeLeft).toFixed(1)} seconds!\nFinal Score: ${score}`,
      [{ text: 'Try Again', onPress: resetGame }]
    );
  };

  const winGame = (): void => {
    Vibration.vibrate([100, 50, 100]);
    setGameState('won');
    const newScore = score + 1;
    const newRound = round + 1;
    const newTargetTime = targetTime + 10; // Increase time by 1 second each round
    
    setScore(newScore);
    setRound(newRound);
    setTargetTime(newTargetTime);
    
    Alert.alert(
      'Success!', 
      `You avoided tapping for ${targetTime} seconds!\nNext round: ${newTargetTime} seconds`,
      [{ text: 'Continue', onPress: resetGame }]
    );
  };

  const resetGame = (): void => {
    setGameState('idle');
    pulseAnim.setValue(1);
  };

  const GameButton: React.FC<{ title: string; onPress: () => void }> = ({ title, onPress }) => (
    <TouchableOpacity style={styles.startButton} onPress={onPress}>
      <Text style={styles.startButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  const ProgressBar: React.FC = () => {
    const widthInterpolate = progressAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    });

    return (
      <View style={styles.progressBar}>
        <Animated.View style={[styles.progressFill, { width: widthInterpolate }]} />
      </View>
    );
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handleTap}
      activeOpacity={1}
    >
      <View style={styles.background}>
        <View style={styles.content}>
          <Text style={styles.title}>
            {gameState === 'idle' ? 'DON\'T TAP' : 
             gameState === 'playing' ? 'DON\'T TAP!' : 
             gameState === 'lost' ? 'GAME OVER' : 'SUCCESS!'}
          </Text>
          
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>SCORE</Text>
                <Text style={styles.infoValue}>{score}</Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>ROUND</Text>
                <Text style={styles.infoValue}>{round}</Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>TARGET</Text>
                <Text style={styles.infoValue}>{targetTime}s</Text>
              </View>
            </View>
            
            {gameState === 'playing' && (
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <Text style={styles.timerText}>{timeLeft.toFixed(1)}s</Text>
              </Animated.View>
            )}
          </View>

          <View style={styles.instructions}>
            {gameState === 'idle' && (
              <>
                <Text style={styles.instructionText}>Press START to begin</Text>
                <Text style={styles.instructionText}>Don't tap the screen for {targetTime} seconds</Text>
                <Text style={styles.hintText}>Each round gets harder</Text>
                <GameButton title="START" onPress={startGame} />
              </>
            )}
            
            {gameState === 'playing' && (
              <>
                <Text style={styles.warningText}>Don't tap anywhere!</Text>
                <ProgressBar />
                <Text style={styles.hintText}>Hold steady...</Text>
              </>
            )}
            
            {gameState === 'lost' && (
              <>
                <Text style={styles.loseText}>You tapped!</Text>
                <Text style={styles.instructionText}>You lasted {(targetTime - timeLeft).toFixed(1)} seconds</Text>
                <Text style={styles.instructionText}>Score: {score}</Text>
                <GameButton title="TRY AGAIN" onPress={resetGame} />
              </>
            )}
            
            {gameState === 'won' && (
              <>
                <Text style={styles.winText}>Perfect!</Text>
                <Text style={styles.instructionText}>You completed round {round - 1}</Text>
                <Text style={styles.instructionText}>Next target: {targetTime}s</Text>
                <GameButton title="CONTINUE" onPress={resetGame} />
              </>
            )}
          </View>
          
          <Text style={styles.footer}>Resist the urge to tap</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    height: height * 0.8,
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginVertical: 20,
    letterSpacing: 2,
  },
  infoContainer: {
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  infoBox: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
    marginBottom: 5,
    letterSpacing: 1,
  },
  infoValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  timerText: {
    fontSize: 48,
    fontWeight: '800',
    color: '#4ecdc4',
    textAlign: 'center',
  },
  instructions: {
    alignItems: 'center',
    justifyContent: 'center',
    height: height * 0.4,
    width: '100%',
  },
  instructionText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginVertical: 8,
    fontWeight: '500',
  },
  hintText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginVertical: 10,
    fontStyle: 'italic',
  },
  warningText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffcc00',
    textAlign: 'center',
    marginVertical: 15,
    letterSpacing: 1,
  },
  loseText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ff6b6b',
    textAlign: 'center',
    marginVertical: 10,
  },
  winText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#4ecdc4',
    textAlign: 'center',
    marginVertical: 10,
  },
  startButton: {
    backgroundColor: '#222',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 30,
    borderWidth: 2,
    borderColor: '#4ecdc4',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  progressBar: {
    width: width * 0.8,
    height: 12,
    backgroundColor: '#222',
    borderRadius: 6,
    marginTop: 30,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4ecdc4',
    borderRadius: 6,
  },
  footer: {
    fontSize: 14,
    color: '#444',
    marginTop: 20,
    fontWeight: '500',
  },
});