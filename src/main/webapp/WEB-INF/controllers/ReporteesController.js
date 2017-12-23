myApp.controller("employeesController", function($scope, $http, myFactory, $mdDialog, appConfig) {
	$scope.records = [];
	$scope.empId = myFactory.getEmpId();
	$scope.empName = myFactory.getEmpName();
	$scope.empEmailId = myFactory.getEmpEmailId();
	$scope.role = myFactory.getEmpRole();
	$scope.avgLoginHrs = "";
	$scope.searchId="";
	$scope.pageTitle = "";
	
	// Date picker related code
	var today = new Date();
	var priorDt = null;
	
	if($scope.role == "HR"){
		$scope.pageTitle = "Employees Login Details";
		priorDt = today;
	}else if($scope.role == "Manager"){
		$scope.pageTitle = "Reportees Login Details";
		priorDt = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
	}
	$scope.maxDate = today;
	$scope.fromDate = priorDt;
	$scope.toDate = today;

	$scope.gridOptions = {
		paginationPageSizes : [ 10, 20, 30, 40, 50, 100],
		paginationPageSize : 10,
	    pageNumber: 1,
		pageSize:10,
		columnDefs : [ 
				{field : 'employeeId',displayName: 'Employee ID', enableColumnMenu: true, enableSorting: true},
				{field : 'employeeName',displayName: 'Name', enableColumnMenu: false, enableSorting: false},
				{field : 'dateOfLogin',displayName: 'Date', enableColumnMenu: true, enableSorting: true},
				{field : 'firstLogin',displayName: 'Login Time', enableColumnMenu: false,enableSorting: false}, 
				{field : 'lastLogout',displayName: 'Logout Time', enableColumnMenu: false, enableSorting: false}, 
				{field : 'totalLoginTime',displayName: 'Total Hours(HH:MM)', enableColumnMenu: false, enableSorting: false} 
			],
		onRegisterApi: function(gridApi) {
		    gridApi.core.on.rowsRendered($scope, function(gridApi) {
		    	var length = gridApi.grid.renderContainers.body.visibleRowCache.length;
		    	if(length > 0){
		    		//Need to make this value dynamic
		    		$scope.avgLoginHrs = "07:55 Hrs";
		    	}
		    });
		}
	};
	$scope.gridOptions.data = [];
	
	$scope.setPageDefaults = function(){
		if($scope.role == "HR"){
			getData(0, getFormattedDate($scope.fromDate), getFormattedDate($scope.toDate), 'onload');
		}
	}
	
	$scope.refreshPage = function(){
		$scope.searchId="";
		$scope.fromDate = priorDt;
		$scope.toDate = today;
		$scope.gridOptions.data = [];
		$scope.setPageDefaults();
	};
	
	$scope.getEmployeeData = function(type){
		var searchId = $scope.searchId;
		var fromDate = getFormattedDate($scope.fromDate);
		var toDate = getFormattedDate($scope.toDate);
		if(type == "blur"){
			if(searchId != "" && isNaN(searchId)){
				showAlert('Please enter only digits');
				setFieldsEmpty();
			}else if(searchId != "" && ((searchId.length >0 && searchId.length <5) || searchId.length>5)){
				showAlert('Employee ID should be 5 digits');
				setFieldsEmpty();
			}else if(searchId != "" && !checkEmpIdRange(searchId)){
				showAlert('Employee ID should be in between '+appConfig.empStartId+' - '+appConfig.empEndId);
				setFieldsEmpty();
			}else{
				if($scope.role == "Manager"){
					if(searchId != ""){
						getData(searchId, fromDate, toDate, 'onblur');
					}
				}else if($scope.role == "HR"){
					if(searchId == "") getData(0, fromDate, toDate, 'onblur');
					else getData(searchId, fromDate, toDate, 'onblur');
				}
			}
		}else if(type == "click"){
			if(searchId == ""){
				if($scope.role == "HR"){
					getData(0, fromDate, toDate, 'onclick');
				}else{
					showAlert('Please enter an Employee ID');
				}
			}else if(searchId != "" && isNaN(searchId)){
				showAlert('Please enter only digits');
				setFieldsEmpty();
			}else if(searchId != "" && !checkEmpIdRange(searchId)){
				showAlert('Employee ID should be in between '+appConfig.empStartId+' - '+appConfig.empEndId);
				setFieldsEmpty();
			}else if(searchId != ""&& (searchId.length < 5 || searchId.length > 5)){
				showAlert('Employee ID should be 5 digits');
				setFieldsEmpty();
			}else{
				getData(searchId, fromDate, toDate, 'onclick');
			}
		}
		
	}
	
	function checkEmpIdRange(searchId){
		return parseInt(searchId) >= appConfig.empStartId && parseInt(searchId) <= appConfig.empEndId;
	}
	
	function getData(empId, fromDate, toDate, type){
		$http({
	        method : "GET",
	        url : appConfig.appUri + "attendance/employeeLoginsBasedOnDate?empId=" + empId + "&fromDate=" + fromDate + "&toDate=" +toDate
	    }).then(function mySuccess(response) {
	    	var recs = response.data;
	    	if(recs.length == 0 && type == "onclick"){
	    		showAlert('No data available');
	    		setFieldsEmpty();
	    	}else{
	    		$scope.gridOptions.data = response.data;
	    	}
	    }, function myError(response) {
	    	showAlert("Something went wrong while fetching data!!!");
	    	$scope.gridOptions.data = [];
	    });
	}

	$scope.validateDates = function(dateValue, from) {
		if($scope.role == "Manager"){
			if(from == "FromDate"){
				var toDt = $scope.toDate;
				var diff = daysBetween(dateValue, toDt);
				if(diff < 30 ){
					showAlert('Date range should have minimum of 30 days difference');
					$scope.fromDate = priorDt;
					$scope.toDate = today;
					setFieldsEmpty();
				}else{
					$scope.fromDate = dateValue;
					$scope.toDate = getCalculatedDate(dateValue, 'Add');
				}
			}else if(from == "ToDate"){
				$scope.toDate = dateValue;
				$scope.fromDate = getCalculatedDate(dateValue, 'Substract');
			}
		}else if($scope.role == "HR"){
			if(from == "FromDate"){
				var toDat = $scope.toDate;
				var difference = daysBetween(dateValue, toDat);
				if(difference < 0 ){
					showAlert('From Date should not be greater than To Date');
					$scope.fromDate = priorDt;
					$scope.toDate = today;
				}else{
					$scope.fromDate = dateValue;
					$scope.toDate = toDat;
				}
			}else if(from == "ToDate"){
				var fromDat = $scope.fromDate;
				var differene = daysBetween(fromDat, dateValue);
				if(differene < 0 ){
					showAlert('To Date should not be less than From Date');
					$scope.fromDate = priorDt;
					$scope.toDate = today;
				}else{
					$scope.fromDate = fromDat;
					$scope.toDate = dateValue;
				}
			}
		}
	};
	
	function showAlert(message) {
		$mdDialog.show($mdDialog.alert().parent(
				angular.element(document.querySelector('#popupContainer')))
				.clickOutsideToClose(true).textContent(message).ariaLabel(
						'Alert Dialog').ok('Ok'));
	}
	
	function getFormattedDate(date){
		var day = date.getDate();
		var month = date.getMonth() + 1;
		var year = date.getFullYear();
		return year + '-' + (month < 10 ? "0" + month : month) + '-'
				+ (day < 10 ? "0" + day : day);
	}
	
	function setFieldsEmpty(){
		$scope.searchId="";
		$scope.fromDate = priorDt;
		$scope.toDate = today;
		$scope.gridOptions.data = [];
	}
	
	function treatAsUTC(date) {
	    var result = new Date(date);
	    result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
	    return result;
	}

	function daysBetween(fromDate, toDate) {
	    var millisecondsPerDay = 24 * 60 * 60 * 1000;
	    return Math.round((treatAsUTC(toDate) - treatAsUTC(fromDate)) / millisecondsPerDay);
	}
	
	function getCalculatedDate(selectedDate, type){
		var futureDt = null;
		if(type == "Add"){
			futureDt = new Date(selectedDate.getTime() + (30 * 24 * 60 * 60 * 1000));
		}else {
			futureDt = new Date(selectedDate.getTime() - (30 * 24 * 60 * 60 * 1000));
		}
		return futureDt;
	}
});
