import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  PanResponder,
  Animated,
  Dimensions,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { ThemedView, ThemedCustomText } from '@components/themed';
import { StackHeader } from '@components/navigation/StackHeader';
import { ClueList } from '@components/ClueList';
import { QRScanner } from '@components/QRScanner';

interface Clue {
  id: number;
  title: string;
  description: string;
  points: number;
  solved: boolean;
}

// Mock data for clues - replace with real data from your API
const MOCK_CLUES: Clue[] = [
  {
    id: 1,
    title: 'Find the Hidden Symbol',
    description: 'Look for the symbol in the main hall',
    points: 10,
    solved: false,
  },
  {
    id: 2,
    title: 'Decode the Message',
    description: 'Figure out what the code means',
    points: 15,
    solved: false,
  },
  {
    id: 3,
    title: 'Solve the Puzzle',
    description: 'Complete the missing pieces',
    points: 20,
    solved: false,
  },
  {
    id: 4,
    title: 'Find the Final Location',
    description: 'Discover where the treasure is hidden',
    points: 25,
    solved: false,
  },
];

const { height } = Dimensions.get('window');

export default function PlayScreen() {
  const { colors } = useTheme();
  const [currentClueIndex, setCurrentClueIndex] = useState(0);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [clues, setClues] = useState(MOCK_CLUES);
  const swipeDistance = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, { dy }) => {
        // Detect upward swipe to open scanner
        if (dy < -20) {
          swipeDistance.current.setValue(Math.abs(dy));
        }
      },
      onPanResponderRelease: (evt, { dy, vy }) => {
        // If swiped up significantly, open scanner
        if (dy < -80 && vy < -0.5) {
          setScannerOpen(true);
        }
        // Reset animation
        Animated.spring(swipeDistance.current, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  const handleSelectClue = (index: number) => {
    setCurrentClueIndex(index);
  };

  const handleOpenScanner = () => {
    setScannerOpen(true);
  };

  const handleScanQR = (data: string) => {
    // Handle the scanned QR code data
    console.log('Scanned QR Code:', data);
    // You can process the data here, e.g., validate it against the current clue
    setScannerOpen(false);
  };

  const handleCloseScanner = () => {
    setScannerOpen(false);
  };

  if (!clues || clues.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <StackHeader
          title="Play"
          subtitle="Solve clues to complete the hunt"
        />
        <View style={[styles.emptyState, { paddingTop: height / 3 }]}>
          <ThemedCustomText variant="h3">No Active Hunts</ThemedCustomText>
          <ThemedCustomText variant="body" style={styles.emptyText}>
            Start or join a hunt to see clues here
          </ThemedCustomText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: colors.background }]}
      {...panResponder.panHandlers}
    >
      <StackHeader
        title="Play"
        subtitle={`${currentClueIndex + 1} of ${clues.length} clues`}
      />

      <View style={styles.clueDisplayContainer}>
        <View style={styles.activeClueCard}>
          <Text style={[styles.clueTitle, { color: colors.text }]}>
            {clues[currentClueIndex]?.title}
          </Text>
          <Text
            style={[styles.clueBody, { color: colors.text }]}
            numberOfLines={6}
          >
            {clues[currentClueIndex]?.description}
          </Text>
          <View style={styles.clueFooter}>
            <Text style={[styles.points, { color: colors.primary }]}>
              {clues[currentClueIndex]?.points} Points
            </Text>
            {clues[currentClueIndex]?.solved && (
              <Text style={styles.solvedBadge}>✓ Solved</Text>
            )}
          </View>
        </View>

        {/* Swipe hint indicator */}
        <Animated.View
          style={[
            styles.swipeHint,
            {
              opacity: swipeDistance.current.interpolate({
                inputRange: [0, 100],
                outputRange: [0.3, 1],
                extrapolate: 'clamp',
              }),
            },
          ]}
        >
          <Text style={styles.swipeHintText}>⬆ Swipe up to scan</Text>
        </Animated.View>
      </View>

      <ClueList
        clues={clues}
        currentIndex={currentClueIndex}
        onSelectClue={handleSelectClue}
        onOpenScanner={handleOpenScanner}
      />

      <QRScanner
        isOpen={scannerOpen}
        onClose={handleCloseScanner}
        onScan={handleScanQR}
        title={`Scan clue #${currentClueIndex + 1}`}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyText: {
    marginTop: 8,
    textAlign: 'center',
  },
  clueDisplayContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'relative',
  },
  activeClueCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#3737A4',
  },
  clueTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  clueBody: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    opacity: 0.8,
  },
  clueFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  points: {
    fontSize: 12,
    fontWeight: '600',
  },
  solvedBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  swipeHint: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  swipeHintText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
});
