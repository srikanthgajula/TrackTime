package com.nisum.mytime.service;

import java.util.List;

import org.bson.types.ObjectId;

import com.nisum.mytime.exception.handler.MyTimeException;
import com.nisum.mytime.model.EmpLoginData;
import com.nisum.mytime.model.EmployeeDashboardVO;
import com.nisum.mytime.model.EmployeeRoles;
import com.nisum.mytime.model.Project;
import com.nisum.mytime.model.ProjectTeamMate;
import com.nisum.mytime.model.TeamMateBilling;

public interface ProjectService {

	List<EmpLoginData> employeeLoginsBasedOnDate(long id, String fromDate, String toDate) throws MyTimeException;

	List<Project> getProjects() throws MyTimeException;

	Project addProject(Project project) throws MyTimeException;

	String generatePdfReport(long id, String fromDate, String toDate) throws MyTimeException;

	EmployeeRoles getEmployeesRole(String emailId);

	void deleteProject(String projectId);

	Project updateProject(Project project);

	EmployeeRoles getEmployeesRoleData(String empId);

	List<ProjectTeamMate> getTeamDetails(String empId);

	public ProjectTeamMate addProjectTeamMate(ProjectTeamMate projectTeamMate) throws MyTimeException;

	ProjectTeamMate updateTeammate(ProjectTeamMate projectTeamMate);

	void deleteTeammate(String empId, String projectId,ObjectId id);

	List<Project> getProjects(String managerId) throws MyTimeException;

	List<ProjectTeamMate> getMyTeamDetails(String empId);

	List<EmployeeRoles> getUnAssignedEmployees();
	
	List<ProjectTeamMate> getShiftDetails(String shift);
	
	List<ProjectTeamMate> getAllProjectDetails();
	
	List<ProjectTeamMate> getProjectDetails(String projectId);
	
	public List<ProjectTeamMate> getMyProjectAllocations(String empId);
	
	List<TeamMateBilling> getEmployeeBillingDetails(String empId,String projectId);

	TeamMateBilling addEmployeeBillingDetails(TeamMateBilling teamMate);

	TeamMateBilling  updateEmployeeBilling(TeamMateBilling teamMate);
	
	public List<EmployeeDashboardVO> getEmployeesDashBoard();
}
