import { useState, useEffect } from "react";
import { FlatList, View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import axios from "axios";
import JobCard from "../components/JobCard";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define Job interface (same as in JobCard)
interface Job {
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
}

export default function JobsScreen() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axios.get(`https://testapi.getlokalapp.com/common/jobs?page=${page}`);
      const newJobs = response.data.results || [];
      setJobs(prevJobs => [...prevJobs, ...newJobs]);
      setPage(prev => prev + 1);
    } catch (err) {
      setError("Failed to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async (job: Job) => {
    try {
      const bookmarks = await AsyncStorage.getItem('bookmarks');
      const bookmarkList: Job[] = bookmarks ? JSON.parse(bookmarks) : [];
      if (!bookmarkList.some(b => b.id === job.id)) {
        const updatedBookmarks = [...bookmarkList, job];
        await AsyncStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
      }
    } catch (err) {
      console.error('Error bookmarking:', err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  };

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchJobs} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={jobs}
        renderItem={({ item }) => (
          <JobCard 
            item={item}
            onBookmark={handleBookmark}
          />
        )}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        onEndReached={fetchJobs}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.center}>
              <Text style={styles.emptyText}>No jobs found</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  footer: { padding: 20 },
  errorText: { fontSize: 16, color: '#ff4444' },
  retryButton: { marginTop: 10, padding: 10, backgroundColor: '#007AFF', borderRadius: 5 },
  retryText: { color: '#fff', fontWeight: 'bold' },
  emptyText: { fontSize: 16, color: '#666' },
});