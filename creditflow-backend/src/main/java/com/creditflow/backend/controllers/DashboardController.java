package com.creditflow.backend.controllers;

import com.creditflow.backend.models.DashboardNotification;
import com.creditflow.backend.models.DashboardTask;
import com.creditflow.backend.repositories.DashboardNotificationRepository;
import com.creditflow.backend.repositories.DashboardTaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardTaskRepository taskRepository;

    @Autowired
    private DashboardNotificationRepository notificationRepository;

    @GetMapping("/tasks")
    public ResponseEntity<List<DashboardTask>> getTasks() {
        return ResponseEntity.ok(taskRepository.findAll());
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<DashboardNotification>> getNotifications() {
        return ResponseEntity.ok(notificationRepository.findAll());
    }

    @PutMapping("/tasks/{id}/toggle")
    public ResponseEntity<?> toggleTask(@PathVariable Long id) {
        DashboardTask task = taskRepository.findById(id).orElse(null);
        if (task == null) {
            return ResponseEntity.notFound().build();
        }
        task.setDone(!task.isDone());
        taskRepository.save(task);
        return ResponseEntity.ok(task);
    }
}
