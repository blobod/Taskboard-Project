package com.taskboard.dto;

import java.util.List;

public class UserDTO {

    private Long id;
    private String email;
    private String name;

    private List<Long> ownedProjectIds;   // IDs of projects owned by the user
    private List<Long> assignedTaskIds;   // IDs of tasks assigned to the user

    public UserDTO() {
    }

    public UserDTO(Long id, String email, String name, List<Long> ownedProjectIds, List<Long> assignedTaskIds) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.ownedProjectIds = ownedProjectIds;
        this.assignedTaskIds = assignedTaskIds;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Long> getOwnedProjectIds() {
        return ownedProjectIds;
    }

    public void setOwnedProjectIds(List<Long> ownedProjectIds) {
        this.ownedProjectIds = ownedProjectIds;
    }

    public List<Long> getAssignedTaskIds() {
        return assignedTaskIds;
    }

    public void setAssignedTaskIds(List<Long> assignedTaskIds) {
        this.assignedTaskIds = assignedTaskIds;
    }
}
