import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, Alert } from 'react-native';
import { useRouter, useSearchParams } from 'expo-router';
import { getHuntById, getHuntClues } from '@store/huntStore';
import type { StoredHunt, Clue } from '@lib/types';

export default function NestedScreen() {
  const router = useRouter();
  const { huntId, clueIndex } = useSearchParams();
  const [hunt, setHunt] = useState<StoredHunt | null>(null);
  const [clues, setClues] = useState<Clue[]>([]);
  const [answer, setAnswer] = useState('');

  const hId = Number(huntId);
  const idx = Number(clueIndex);
  const clue = clues[idx];
  const isLast = idx === clues.length - 1;

  useEffect(() => {
    Promise.all([getHuntById(hId), getHuntClues(hId)]).then(([hunt, clues]) => {
      if (hunt) setHunt(hunt);
      setClues(clues);
    });
  }, [hId]);

  const handleSubmit = () => {
    if (!clue) return;
    const correct = answer.trim().toLowerCase() === clue.answer.trim().toLowerCase();
    if (!correct) {
      Alert.alert('Incorrect', 'Try again');
      return;
    }
    if (isLast) {
      Alert.alert('Complete!', 'You finished the hunt!');
      router.replace(`/details?huntId=${hId}`);
    } else {
      router.replace(`/nested?huntId=${hId}&clueIndex=${idx + 1}`);
    }
  };

  if (!clue) return <View style={styles.container} />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Clue {idx + 1} of {clues.length}</Text>
      <Text style={styles.question}>{clue.question}</Text>
      <TextInput
        style={styles.input}
        placeholder="Your answer"
        value={answer}
        onChangeText={setAnswer}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{isLast ? 'Finish' : 'Next'}</Text>
      </Pressable>
      <Pressable
        style={[styles.button, styles.backButton]}
        onPress={() => router.back()}
      >
        <Text style={styles.buttonText}>Back</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  backButton: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: '#444',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  feedback: {
    marginBottom: 12,
    color: '#cc0000',
  },
  linkRow: {
    marginTop: 18,
  },
});
