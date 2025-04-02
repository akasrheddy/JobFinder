import { useState, useEffect } from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JobCard from './components/JobCard';

// Job type definition
type Job = {
  id: string;
  title?: string;
  primary_details?: {
    Place?: string;
    Salary?: string;
  };
  whatsapp_no?: string;
  company_name?: string;
  job_category?: string;
  [key: string]: any;
};

export default function BookmarksScreen() {
  const [bookmarks, setBookmarks] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const storedBookmarks = await AsyncStorage.getItem('bookmarks');
        const bookmarkList = storedBookmarks ? JSON.parse(storedBookmarks) : [];
        setBookmarks(bookmarkList);
      } catch (err) {
        console.error('Error loading bookmarks:', err);
      } finally {
        setLoading(false);
      }
    };
    loadBookmarks();
  }, []);

const handleBookmark = async (job: Job) => {
    // Optional: Add remove bookmark logic here if desired
    console.log('Bookmark action not implemented for removal yet');
};

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Loading bookmarks...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={bookmarks}
        renderItem={({ item }) => (
          <JobCard 
            item={item}
            onBookmark={handleBookmark}
          />
        )}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>No bookmarks yet</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 16, color: '#666' },
  emptyText: { fontSize: 16, color: '#666' },
});