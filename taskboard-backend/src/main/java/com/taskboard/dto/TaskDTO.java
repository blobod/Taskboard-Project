package com.taskboard.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class TaskDTO {
    private Long id;
    private String title;
    private String status;
    private Long projectId;
    private Long assigneeId;
}
