package com.nisum.mytime.model;

import java.io.Serializable;
import java.util.Date;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Document(collection = "ProjectTeamMate")
public class ProjectTeamMate implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	private ObjectId id;
	private String employeeId;
	private String employeeName;
	private String emailId;
	private String role;
	private String shift;
	private String projectId;
	private String projectName;
	private String account;
	private String managerId;
	private String managerName;
	private String experience;
	private String designation;
	private String billableStatus;
	private String mobileNumber;
	@DateTimeFormat(iso = ISO.DATE)
	private Date startDate;
	@DateTimeFormat(iso = ISO.DATE)
	private Date endDate;
	private boolean active;
	
}
