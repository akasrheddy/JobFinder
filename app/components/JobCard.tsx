import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

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

interface JobCardProps {
  item: Job | undefined;
  onBookmark: (job: Job) => Promise<void>;
}

// Type the href prop explicitly to match Expo Router's expectations
type JobDetailsRoute = {
  pathname: '/jobs/[id]'; // Match the dynamic route
  params: {
    id: string; // The dynamic parameter
    job: string; // Additional param you're passing
  };
};

export default function JobCard({ item, onBookmark }: JobCardProps) {
  if (!item) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Invalid Job Data</Text>
      </View>
    );
  }

  const href: JobDetailsRoute = {
    pathname: '/jobs/[id]', // Use the exact route name
    params: {
      id: item.id, // Pass the id as a param
      job: JSON.stringify(item), // Pass the full job object as a string
    },
  };

  return (
    <Link href={href} asChild>
      <TouchableOpacity>
        <View style={styles.card}>
          <Text style={styles.title}>{item.title || "Untitled Job"}</Text>
          <Text style={styles.detail}>Location: {item.primary_details?.Place || "Not specified"}</Text>
          <Text style={styles.detail}>Salary: {item.primary_details?.Salary || "Not disclosed"}</Text>
          <Text style={styles.detail}>Phone: {item.whatsapp_no || "Not available"}</Text>
          <TouchableOpacity onPress={() => onBookmark(item)} style={styles.bookmarkButton}>
            <Text style={styles.bookmarkText}>Bookmark</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  detail: { fontSize: 14, color: '#666', marginBottom: 3 },
  bookmarkButton: { marginTop: 5 },
  bookmarkText: { color: '#007AFF', fontWeight: 'bold' },
});