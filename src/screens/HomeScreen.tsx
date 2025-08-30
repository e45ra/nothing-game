import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Vibration,
  Alert,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AboutScreen from "./AboutScreen";

const { width, height } = Dimensions.get("window");

type GameState = "idle" | "playing" | "lost" | "won";

export default function HomeScreen() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const [score, setScore] = useState<number>(0);
  const [round, setRound] = useState<number>(1);
  const [targetTime, setTargetTime] = useState<number>(10);
  const [showAbout, setShowAbout] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const celebrationAnim = useRef(new Animated.Value(0)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;

  // Celebration emojis and messages
  const celebrationEmojis = ["🎉", "🎊", "🔥", "⭐", "🏆", "💎", "🚀", "👑"];
  const celebrationMessages = [
    "AMAZING!",
    "INCREDIBLE!",
    "LEGENDARY!",
    "UNSTOPPABLE!",
    "PHENOMENAL!",
    "EXTRAORDINARY!",
    "SPECTACULAR!",
    "FLAWLESS!"
  ];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (gameState === "playing" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
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
    if (gameState === "playing") {
      Animated.timing(progressAnim, {
        toValue: (targetTime - timeLeft) / targetTime,
        duration: 150,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();

      if (timeLeft < 3) {
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.15,
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

  const startCelebration = () => {
    setShowCelebration(true);
    celebrationAnim.setValue(0);
    confettiAnim.setValue(0);
    
    // Celebration animation sequence
    Animated.parallel([
      Animated.timing(celebrationAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(confettiAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    ]).start();

    // Auto-hide celebration after 3 seconds
    setTimeout(() => {
      setShowCelebration(false);
    }, 3000);
  };

  const startGame = (): void => {
    setGameState("playing");
    setTimeLeft(targetTime);
    progressAnim.setValue(0);
  };

  const handleTap = (): void => {
    if (gameState === "playing") {
      loseGame();
    }
  };

  const loseGame = (): void => {
    Vibration.vibrate(300);
    setGameState("lost");

    // shake animation
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();

    Alert.alert(
      "Game Over",
      `You tapped after ${(targetTime - timeLeft).toFixed(
        1
      )} seconds!\nFinal Score: ${score}`,
      [{ text: "Try Again", onPress: resetGame }]
    );
  };

  const winGame = (): void => {
    Vibration.vibrate([100, 50, 100]);
    setGameState("won");
    const newScore = score + 1;
    const newRound = round + 1;
    const newTargetTime = targetTime + 10;

    setScore(newScore);
    setRound(newRound);
    setTargetTime(newTargetTime);

    // Start celebration
    startCelebration();

    Alert.alert(
      "🎉 Success!",
      `You avoided tapping for ${targetTime} seconds!\nNext round: ${newTargetTime} seconds`,
      [{ text: "Continue", onPress: resetGame }]
    );
  };

  const resetGame = (): void => {
    setGameState("idle");
    pulseAnim.setValue(1);
  };

  const GameButton: React.FC<{ title: string; onPress: () => void }> = ({
    title,
    onPress,
  }) => (
    <TouchableOpacity style={styles.startButton} onPress={onPress}>
      <LinearGradient
        colors={["#4ecdc4", "#1a535c"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientButton}
      >
        <Text style={styles.startButtonText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const ProgressBar: React.FC = () => {
    const widthInterpolate = progressAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ["0%", "100%"],
    });

    return (
      <View style={styles.progressBar}>
        <Animated.View
          style={[styles.progressFill, { width: widthInterpolate }]}
        />
      </View>
    );
  };

  const ConfettiPiece = ({ delay, emoji }: { delay: number, emoji: string }) => {
    const animValue = useRef(new Animated.Value(0)).current;
    
    useEffect(() => {
      setTimeout(() => {
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: 1000,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 500,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
          }),
        ]).start();
      }, delay);
    }, []);

    const translateY = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -300],
    });

    const opacity = animValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 1, 0],
    });

    const scale = animValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 1, 0.5],
    });

    const rotate = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    const left = useRef(Math.random() * width).current;

    return (
      <Animated.Text 
        style={[
          styles.confettiPiece,
          {
            left,
            opacity,
            transform: [{ translateY }, { scale }, { rotate }],
          },
        ]}
      >
        {emoji}
      </Animated.Text>
    );
  };

  const Celebration = () => {
    const scale = celebrationAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.5, 1.5],
    });

    const opacity = celebrationAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 1, 1],
    });

    const messageIndex = Math.floor(Math.random() * celebrationMessages.length);
    const message = celebrationMessages[messageIndex];

    return (
      <View style={styles.celebrationContainer} pointerEvents="none">
        {/* Confetti pieces */}
        {celebrationEmojis.map((emoji, index) => (
          <ConfettiPiece 
            key={index} 
            delay={index * 100} 
            emoji={emoji} 
          />
        ))}
        
        {/* Celebration message */}
        <Animated.View style={[styles.celebrationMessage, { opacity, transform: [{ scale }] }]}>
          <Text style={styles.celebrationText}>{message}</Text>
          <Text style={styles.celebrationSubtext}>You're a tapping avoidance master!</Text>
        </Animated.View>
      </View>
    );
  };

  if (showAbout) {
    return <AboutScreen onClose={() => setShowAbout(false)} />;
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handleTap}
      activeOpacity={1}
    >
      <LinearGradient
        colors={["#000", "#111", "#222"]}
        style={styles.background}
      >
        {/* About Button */}
        <TouchableOpacity
          style={styles.aboutButton}
          onPress={() => setShowAbout(true)}
        >
          <Ionicons name="information-circle" size={28} color="#4ecdc4" />
        </TouchableOpacity>

        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateX: shakeAnim }],
            },
          ]}
        >
          <Animated.Text
            style={[
              styles.title,
              {
                transform: [
                  {
                    scale:
                      gameState === "playing" ? pulseAnim : new Animated.Value(1),
                  },
                ],
              },
            ]}
          >
            {gameState === "idle"
              ? "DON'T TAP"
              : gameState === "playing"
              ? "DON'T TAP!"
              : gameState === "lost"
              ? "GAME OVER"
              : "SUCCESS!"}
          </Animated.Text>

          {/* Score & Round */}
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

            {gameState === "playing" && (
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <Text style={styles.timerText}>{timeLeft.toFixed(1)}s</Text>
              </Animated.View>
            )}
          </View>

          {/* Instructions */}
          <View style={styles.instructions}>
            {gameState === "idle" && (
              <>
                <Text style={styles.instructionText}>
                  Press START to begin
                </Text>
                <Text style={styles.instructionText}>
                  Don't tap for {targetTime} seconds
                </Text>
                <Text style={styles.hintText}>Each round gets harder</Text>
                <GameButton title="START" onPress={startGame} />
              </>
            )}

            {gameState === "playing" && (
              <>
                <Text style={styles.warningText}>Don't tap anywhere!</Text>
                <ProgressBar />
                <Text style={styles.hintText}>Hold steady...</Text>
              </>
            )}

            {gameState === "lost" && (
              <>
                <Text style={styles.loseText}>💀 You tapped!</Text>
                <Text style={styles.instructionText}>
                  You lasted {(targetTime - timeLeft).toFixed(1)} seconds
                </Text>
                <Text style={styles.instructionText}>Score: {score}</Text>
                <GameButton title="TRY AGAIN" onPress={resetGame} />
              </>
            )}

            {gameState === "won" && (
              <>
                <Text style={styles.winText}>🎉 Perfect!</Text>
                <Text style={styles.instructionText}>
                  You completed round {round - 1}
                </Text>
                <Text style={styles.instructionText}>
                  Next target: {targetTime}s
                </Text>
                <GameButton title="CONTINUE" onPress={resetGame} />
              </>
            )}
          </View>

          <Text style={styles.footer}>⚡ Resist the urge to tap ⚡</Text>
        </Animated.View>

        {/* Celebration Overlay */}
        {showCelebration && <Celebration />}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    height: height * 0.8,
    width: "100%",
  },
  aboutButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    padding: 8,
  },
  title: {
    fontSize: 38,
    fontWeight: "800",
    color: "#4ecdc4",
    textAlign: "center",
    marginVertical: 20,
    letterSpacing: 2,
    textShadowColor: "rgba(78,205,196,0.7)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  infoContainer: {
    alignItems: "center",
    marginVertical: 20,
    width: "100%",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  infoBox: {
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 12,
    color: "#aaa",
    fontWeight: "600",
    marginBottom: 5,
    letterSpacing: 1,
  },
  infoValue: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
  },
  timerText: {
    fontSize: 50,
    fontWeight: "900",
    color: "#ffcc00",
    textAlign: "center",
    textShadowColor: "rgba(255,204,0,0.7)",
    textShadowRadius: 10,
  },
  instructions: {
    alignItems: "center",
    justifyContent: "center",
    height: height * 0.4,
    width: "100%",
  },
  instructionText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginVertical: 8,
    fontWeight: "500",
  },
  hintText: {
    fontSize: 14,
    color: "#bbb",
    textAlign: "center",
    marginVertical: 10,
    fontStyle: "italic",
  },
  warningText: {
    fontSize: 26,
    fontWeight: "800",
    color: "#ffcc00",
    textAlign: "center",
    marginVertical: 15,
    letterSpacing: 1,
  },
  loseText: {
    fontSize: 32,
    fontWeight: "800",
    color: "#ff6b6b",
    textAlign: "center",
    marginVertical: 10,
  },
  winText: {
    fontSize: 32,
    fontWeight: "800",
    color: "#4ecdc4",
    textAlign: "center",
    marginVertical: 10,
  },
  startButton: {
    marginTop: 30,
    borderRadius: 30,
    overflow: "hidden",
  },
  gradientButton: {
    paddingHorizontal: 50,
    paddingVertical: 15,
    borderRadius: 30,
  },
  startButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1,
    textAlign: "center",
  },
  progressBar: {
    width: width * 0.8,
    height: 14,
    backgroundColor: "#333",
    borderRadius: 7,
    marginTop: 30,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4ecdc4",
    borderRadius: 7,
  },
  footer: {
    fontSize: 16,
    color: "#888",
    marginTop: 20,
    fontWeight: "500",
  },
  celebrationContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },
  celebrationMessage: {
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#4ecdc4",
  },
  celebrationText: {
    fontSize: 36,
    fontWeight: "900",
    color: "#ffcc00",
    textAlign: "center",
    marginBottom: 10,
  },
  celebrationSubtext: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
  },
  confettiPiece: {
    position: "absolute",
    fontSize: 30,
    top: height / 2,
  },
});