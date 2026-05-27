import { useState, useEffect } from 'react';
import { StyleSheet, FlatList, View, Text, Pressable } from 'react-native';
import { useRouter, useSearchParams } from 'expo-router';
import { getHuntById, getHuntClues } from '@store/huntStore';
import type { StoredHunt, Clue } from '@lib/types';

export default function DetailsScreen() {
  const router = useRouter();
  const { huntId } = useSearchParams();
  const [hunt, setHunt] = useState<StoredHunt | null>(null);
  const [clues, setClues] = useState<Clue[]>([]);

  useEffect(() => {
    const id = Number(huntId);
    Promise.all([getHuntById(id), getHuntClues(id)]).then(([hunt, clues]) => {
      if (hunt) setHunt(hunt);
      setClues(clues);
    });
  }, [huntId]);

  if (!hunt) return <View style={styles.container} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{hunt.title}</Text>
      <Text style={styles.subtitle}>{hunt.description}</Text>
      <Text style={styles.clueCount}>Clues: {clues.length}</Text>
      <FlatList
        scrollEnabled={false}
        data={clues}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() => router.push(`/nested?huntId=${hunt.id}&clueIndex=${index}`)}
            style={styles.clueItem}
          >
            <Text style={styles.clueNum}>#{index + 1}</Text>
            <Text style={styles.clueQuestion}>{item.question}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  clueCount: {
    fontSize: 12,
    color: '#999',
    marginBottom: 16,
  },
  clueItem: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
    alignItems: 'center',
  },
  clueNum: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginRight: 12,
    minWidth: 30,
  },
  clueQuestion: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    color: '#555',
    marginBottom: 12,
  },
  meta: {
    color: '#777',
    marginBottom: 18,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  clueCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  solvedCard: {
    backgroundColor: '#e6f7e6',
  },
  clueLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  clueStatus: {
    color: '#444',
  },
  completeText: {
    color: '#0a7d3e',
    marginBottom: 14,
    fontWeight: '600',
  },
  linkRow: {
    marginTop: 22,
  },
});
