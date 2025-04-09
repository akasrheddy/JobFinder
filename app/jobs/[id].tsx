import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function JobDetailsScreen() {
  const { id } = useLocalSearchParams();
  interface Job {
    id: string;
    title: string;
    primary_details?: {
      Place?: string;
      Salary?: string;
    };
    whatsapp_no?: string;
    company_name?: string;
    job_category?: string;
  }

  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {
    const loadJob = async () => {
      const jobs = await AsyncStorage.getItem('bookmarks'); 
      const jobList = jobs ? JSON.parse(jobs) : [];
    const foundJob = jobList.find((j: Job) => j.id === id);
      setJob(foundJob); 
    };
    loadJob();
  }, [id]);

  if (!job) {
    return (
      <View style={styles.center}>
        <Text>Loading job details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{job.title || "Untitled Job"}</Text>
        <Text style={styles.detail}>Location: {job.primary_details?.Place || "Not specified"}</Text>
        <Text style={styles.detail}>Salary: {job.primary_details?.Salary || "Not disclosed"}</Text>
        <Text style={styles.detail}>Phone: {job.whatsapp_no || "Not available"}</Text>
        <Text style={styles.detail}>Company: {job.company_name || "N/A"}</Text>
        {job.job_category && (
          <Text style={styles.detail}>Category: {job.job_category}</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  detail: { fontSize: 16, marginBottom: 8, color: '#333' },
});
