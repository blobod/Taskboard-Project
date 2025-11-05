package com.taskboard.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter @Setter
public class ProjectDTO {
    private Long id;
    private String name;
    private String description;
    private Long ownerId;
    private List<TaskDTO> tasks;
}
