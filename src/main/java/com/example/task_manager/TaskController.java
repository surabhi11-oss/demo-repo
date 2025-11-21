package com.example.task_manager;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")  // allow frontend to call this API
public class TaskController {

    private final TaskRepository repo;

    public TaskController(TaskRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Task> getAllTasks() {
        return repo.findAll();
    }

    @PostMapping
    public Task createTask(@RequestBody Map<String, Object> body) {
        String text = (String) body.get("text");
        Task task = new Task(text);
        return repo.save(task);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {

        Task task = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (body.containsKey("text")) {
            task.setText((String) body.get("text"));
        }

        if (body.containsKey("completed")) {
            task.setCompleted((Boolean) body.get("completed"));
        }

        Task updated = repo.save(task);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteTask(@PathVariable Long id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        repo.deleteById(id);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Task deleted");

        return ResponseEntity.ok(response);
    }
}
