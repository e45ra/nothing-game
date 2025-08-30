import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Vibration } from 'react-native';

export default function App() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameActive(false);
      if (score > highScore) {
        setHighScore(score);
      }
    }
  }, [gameActive, timeLeft]);

  const handleTap = () => {
    if (gameActive && timeLeft > 0) {
      setScore(score + 1);
      Vibration.vibrate(50); // Short vibration feedback
    }
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameActive(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nothing Game</Text>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Time: {timeLeft}s</Text>
        <Text style={styles.infoText}>Score: {score}</Text>
        <Text style={styles.infoText}>High Score: {highScore}</Text>
      </View>

      <TouchableOpacity 
        style={styles.gameArea}
        onPress={handleTap}
        activeOpacity={1}
      >
        {gameActive ? (
          <>
            <Text style={styles.tapText}>Tap Nothing!</Text>
            <Text style={styles.hintText}>(Seriously, just tap anywhere)</Text>
          </>
        ) : (
          <>
            {timeLeft === 0 ? (
              <Text style={styles.gameOverText}>Game Over!</Text>
            ) : null}
            <TouchableOpacity style={styles.startButton} onPress={startGame}>
              <Text style={styles.startButtonText}>
                {timeLeft === 0 ? 'Play Again' : 'Start Game'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </TouchableOpacity>

      <Text style={styles.footer}>The point is that there is no point</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
  },
  infoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  infoText: {
    fontSize: 18,
    marginVertical: 5,
    color: '#555',
  },
  gameArea: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  tapText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 10,
  },
  hintText: {
    fontSize: 16,
    color: '#888',
    fontStyle: 'italic',
  },
  gameOverText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    fontSize: 14,
    color: '#999',
    marginBottom: 20,
    fontStyle: 'italic',
  },
});