import { router } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";

type Task = {
  id: string;
  title: string;
  done: boolean;
};

export default function HomeScreen() {
  const [task, setTask] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = () => {
    if (!task.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: task,
      done: false,
    };

    setTasks((prev) => [...prev, newTask]);
    setTask("");
  };

  const completeTask = (id: string) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, done: true } : t
    );

    setTasks(updated);

    const completed = updated.filter((t) => t.done);

    router.push({
      pathname: "/explore",
      params: {
        data: JSON.stringify(completed),
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛋️ LazyTask</Text>

      <TextInput
        placeholder="Enter a task..."
        value={task}
        onChangeText={setTask}
        style={styles.input}
      />

      <TouchableOpacity style={styles.addButton} onPress={addTask}>
        <Text style={styles.buttonText}>Add Task</Text>
      </TouchableOpacity>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        style={{ width: "100%", marginTop: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.taskItem,
              item.done && styles.taskDone,
            ]}
            onPress={() => completeTask(item.id)}
          >
            <Text
              style={[
                styles.taskText,
                item.done && styles.taskTextDone,
              ]}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.bottomButton}
        onPress={() => router.push("/explore")}
      >
        <Text style={styles.buttonText}>Go to Completed</Text>
      </TouchableOpacity>
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
    fontSize: 32,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 20,
  },

  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  addButton: {
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },

  bottomButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  taskItem: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  taskDone: {
    backgroundColor: "#d7ffd9",
  },

  taskText: {
    fontSize: 16,
    color: "#333",
  },

  taskTextDone: {
    textDecorationLine: "line-through",
    color: "#666",
  },
});