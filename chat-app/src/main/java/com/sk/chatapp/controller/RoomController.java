package com.sk.chatapp.controller;

import com.sk.chatapp.entity.Room;
import com.sk.chatapp.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    @Autowired
    private RoomRepository roomRepository;

    @GetMapping
    public ResponseEntity<List<Room>> listRooms() {
        List<Room> rooms = roomRepository.findAll();
        return ResponseEntity.ok(rooms);
    }

    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        if (name == null || name.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Room name is required"));
        }

        if (roomRepository.findByName(name).isPresent()) {
            return ResponseEntity.status(409).body(Map.of("error", "Room already exists"));
        }

        Room room = new Room(name.trim(), false);
        Room saved = roomRepository.save(room);
        return ResponseEntity.created(URI.create("/api/rooms/" + saved.getId())).body(saved);
    }
}
