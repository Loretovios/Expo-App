import { router } from "expo-router";
import { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Task = {
  id: string;
  title: string;
  done: boolean;
  createdAt: Date;
};

export default function HomeScreen() {
  const [task, setTask] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = useCallback(() => {
    const trimmedTask = task.trim();
    if (!trimmedTask) {
      Alert.alert("Error", "Please enter a task");
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: trimmedTask,
      done: false,
      createdAt: new Date(),
    };

    setTasks((prev) => [newTask, ...prev]);
    setTask("");
  }, [task]);

  const completeTask = useCallback(
    (id: string) => {
      const taskToComplete = tasks.find((t) => t.id === id);
      if (!taskToComplete) return;

      const updatedTasks = tasks.map((t) =>
        t.id === id ? { ...t, done: true } : t
      );

      setTasks(updatedTasks);

      const completedTasks = updatedTasks.filter((t) => t.done);
      
      // Convert dates to ISO strings for serialization
      const serializedTasks = completedTasks.map(t => ({
        ...t,
        createdAt: t.createdAt.toISOString()
      }));

      router.push({
        pathname: "/explore",
        params: {
          data: JSON.stringify(serializedTasks),
        },
      });
    },
    [tasks]
  );

  const deleteTask = useCallback((id: string) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setTasks((prev) => prev.filter((t) => t.id !== id));
        },
      },
    ]);
  }, []);

  const renderTask = useCallback(
    ({ item }: { item: Task }) => (
      <TouchableOpacity
        style={[styles.taskItem, item.done && styles.taskDone]}
        onPress={() => completeTask(item.id)}
        onLongPress={() => deleteTask(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.taskContent}>
          <Text
            style={[
              styles.taskText,
              item.done && styles.taskTextDone,
            ]}
            numberOfLines={2}
          >
            {item.title}
          </Text>
          {item.done && (
            <View style={styles.completedBadge}>
              <Text style={styles.completedBadgeText}>✓</Text>
            </View>
          )}
        </View>
        <Text style={styles.taskDate}>
          {item.createdAt.toLocaleDateString()}
        </Text>
      </TouchableOpacity>
    ),
    [completeTask, deleteTask]
  );

  const activeTasks = tasks.filter((t) => !t.done).length;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.header}>
          <Text style={styles.title}> Dakoa sa Akong Problema Bai! </Text>
          <Text style={styles.subtitle}>
            {activeTasks} task{activeTasks !== 1 ? "s" : ""} remaining
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter a task..."
            placeholderTextColor="#999"
            value={task}
            onChangeText={setTask}
            style={styles.input}
            returnKeyType="done"
            onSubmitEditing={addTask}
            maxLength={100}
          />
          <TouchableOpacity
            style={[styles.addButton, !task.trim() && styles.addButtonDisabled]}
            onPress={addTask}
            disabled={!task.trim()}
          >
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          style={styles.taskList}
          contentContainerStyle={styles.taskListContent}
          renderItem={renderTask}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>✨ No tasks yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Add your first task above!
              </Text>
            </View>
          }
        />

        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() => {
            const completedTasks = tasks.filter((t) => t.done);
            const serializedTasks = completedTasks.map(t => ({
              ...t,
              createdAt: t.createdAt.toISOString()
            }));
            router.push({
              pathname: "/explore",
              params: {
                data: JSON.stringify(serializedTasks),
              },
            });
          }}
        >
          <Text style={styles.buttonText}>
            📋 View Completed ({tasks.filter((t) => t.done).length})
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  keyboardAvoidingView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  addButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: "center",
    shadowColor: "#2196F3",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonDisabled: {
    backgroundColor: "#BBDEFB",
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  taskList: {
    flex: 1,
  },
  taskListContent: {
    paddingBottom: 20,
  },
  taskItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  taskContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskDone: {
    backgroundColor: "#E8F5E9",
    borderColor: "#4CAF50",
    borderWidth: 1,
  },
  taskText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  taskTextDone: {
    textDecorationLine: "line-through",
    color: "#666",
  },
  taskDate: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
  },
  completedBadge: {
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  completedBadgeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  bottomButton: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
    alignItems: "center",
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyState: {
    alignItems: "center",
    marginTop: 60,
  },
  emptyStateText: {
    fontSize: 20,
    color: "#999",
    fontWeight: "600",
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#BBB",
    marginTop: 4,
  },
});