package com.taskboard.dto;

import java.util.List;

public class ProjectDTO {

    private Long id; //id of the project
    private String name; //name of the project
    private String description; //description
    private Long ownerId; //id of the owner
    private List<Long> taskIds; // List of task ids under this project

    public ProjectDTO() {
    }

    public ProjectDTO(Long id, String name, String description, Long ownerId, List<Long> taskIds) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.ownerId = ownerId;
        this.taskIds = taskIds;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    public List<Long> getTaskIds() {
        return taskIds;
    }

    public void setTaskIds(List<Long> taskIds) {
        this.taskIds = taskIds;
    }
}
