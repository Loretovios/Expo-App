import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, FlatList } from "react-native";

type Task = {
  id: string;
  title: string;
  done: boolean;
};

export default function Explore() {
  const { data } = useLocalSearchParams();

  const tasks: Task[] = data ? JSON.parse(data as string) : [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✅ Completed Tasks</Text>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text style={styles.taskText}>{item.title}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No completed tasks yet</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#F5F5F5",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 20,
  },

  taskItem: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  taskText: {
    fontSize: 16,
  },

  empty: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
});