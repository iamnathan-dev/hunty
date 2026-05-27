import { useState, useEffect } from 'react';
import { StyleSheet, FlatList, View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { getAllHunts } from '@store/huntStore';
import type { StoredHunt } from '@lib/types';

export default function HuntsScreen() {
  const router = useRouter();
  const [hunts, setHunts] = useState<StoredHunt[]>([]);

  useEffect(() => {
    getAllHunts().then((data) => {
      setHunts(data.filter((h) => h.status === 'Active'));
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Active Hunts</Text>
      <FlatList
        data={hunts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/details?huntId=${item.id}`)}
            style={styles.card}
          >
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDesc}>{item.description}</Text>
            <Text style={styles.cardMeta}>{item.cluesCount} clues</Text>
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
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  cardMeta: {
    fontSize: 12,
    color: '#999',
  },
});
