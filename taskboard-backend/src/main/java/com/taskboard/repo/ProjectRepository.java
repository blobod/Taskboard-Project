package com.taskboard.repo;
import com.taskboard.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ProjectRepository extends JpaRepository<Project, Long> {}
