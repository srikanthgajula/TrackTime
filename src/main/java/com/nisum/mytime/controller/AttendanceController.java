package com.nisum.mytime.controller;

import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nisum.mytime.exception.handler.MyTimeException;
import com.nisum.mytime.model.AttendenceData;
import com.nisum.mytime.model.EmpLoginData;
import com.nisum.mytime.service.AttendanceService;
import com.nisum.mytime.service.UserService;

@RestController
@RequestMapping("/attendance")
public class AttendanceController {

	@Autowired
	private UserService userService;

	@Autowired
	private AttendanceService attendanceService;

	@RequestMapping(value = "employeeLoginsBasedOnDate", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<EmpLoginData>> employeeLoginsBasedOnDate(@RequestParam("empId") long id,
			@RequestParam("fromDate") String fromDate, @RequestParam("toDate") String toDate) throws MyTimeException {
		List<EmpLoginData> message = userService.employeeLoginsBasedOnDate(id, fromDate, toDate);
		return new ResponseEntity<>(message, HttpStatus.OK);
	}

	@RequestMapping(value = "generatePdfReport/{id}/{fromDate}/{toDate}", method = RequestMethod.GET, produces = MediaType.TEXT_PLAIN_VALUE)
	public ResponseEntity<String> generatePdfReport(@PathVariable("id") long id,
			@PathVariable("fromDate") String fromDate, @PathVariable("toDate") String toDate) throws MyTimeException {
		String result = userService.generatePdfReport(id, fromDate, toDate);
		return new ResponseEntity<>(result, HttpStatus.OK);
	}

	@RequestMapping(value = "attendanciesReport/{reportDate}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<AttendenceData>> attendanciesReport(@PathVariable("reportDate") String reportDate)
			throws MyTimeException, SQLException {
		List<AttendenceData> lisOfAttendenceData = attendanceService.getAttendanciesReport(reportDate);
		return new ResponseEntity<>(lisOfAttendenceData, HttpStatus.OK);
	}

	@RequestMapping(value = "employeesDataSave/{searchDate}", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Boolean> employeesDataSave(@PathVariable("searchDate") String searchDate)
			throws MyTimeException {
		Boolean result = userService.fetchEmployeesData(searchDate,false);
		return new ResponseEntity<>(result, HttpStatus.OK);
	}

	@RequestMapping(value = "copyRemoteMdbFileToLocal", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Boolean> copyRemoteMdbFileToLocal() throws MyTimeException {
		Boolean result = attendanceService.copyRemoteMdbFileToLocal();
		return new ResponseEntity<>(result, HttpStatus.OK);
	}

	@RequestMapping(value = "resyncMonthData/{fromDate}", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Boolean> resyncMonthData(@PathVariable("fromDate") String fromDate) throws MyTimeException {
		Boolean result = userService.fetchEmployeesData(fromDate,true);
		return new ResponseEntity<>(result, HttpStatus.OK);
	}

}