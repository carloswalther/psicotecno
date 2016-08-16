angular.module('HistoricModule').controller('HistoricController',
  ['$scope', "$http", function ($scope, $http) {
    $scope.newPatient = {};
    $scope.historics = [];
    $scope.filter = "";
    $scope.newHistoric = {};
    $scope.newHistoric.patient = {};
    $scope.newHistoric.company = {};
    $scope.newHistoric.company.centralPayment = false;

    $scope.newHistoric.exam = {};
    $scope.newHistoric.pooc = "OC";
    $scope.newHistoric.mutual = "Mutual";
    $scope.newHistoric.registerDate = new Date();


    $scope.exams = appVars.exams;


    io.socket.post("/historic/getAll", {date: new Date()}, function (data) {
      if (data.err) {
        msg('Problema al cargar historico', '', 'warning');
      } else {
        $scope.historics = data;
      }
      $scope.$apply();
    });


    /**
     *
     * @param {type} selected objeto seleccionado
     * @returns {undefined}
     */
    $scope.addPatient = function (selected) {
      // verifica que elevento sea el de capturar un elemento
      if (!_.isUndefined(selected)) {
        $scope.newHistoric.patient = $.extend({}, selected.originalObject)
        //$scope.itemSelected = selected.originalObject;
      }
    };
    /**
     *
     * @param {type} selected objeto seleccionado compañia de la lista
     * @returns {undefined}
     */
    $scope.addCompany = function (selected) {
      // verifica que elevento sea el de capturar un elemento
      if (!_.isUndefined(selected)) {
        $scope.newHistoric.company = $.extend({}, selected.originalObject)
        //$scope.itemSelected = selected.originalObject;
      }
    };

    $scope.saveHistoric = function () {
      // verifica que elevento sea el de capturar un elemento
      if (!_.isEmpty($scope.newHistoric.patient)
        && !_.isEmpty($scope.newHistoric.exam)
        && !_.isEmpty($scope.newHistoric.company)) {

        io.socket.post("/historic/create", {historic: $scope.newHistoric}, function (data) {
          if (data) {
            var historic = $.extend(data, $scope.newHistoric);
            $scope.historics.push(historic);
            //$scope.clarAll();
            $scope.newHistoric.exam = null;
            $scope.$apply();
          } else {
            msg("No se pudo crear", "", "warning");
          }
        });
      } else {
        msg("Hay campos obligatorios que no se han llenador", "", "warning");
      }

    };

    $scope.deleteHistoric = function (historic) {
      console.log(historic)
      if (confirm("¿Seguro que quieres eliminar este registro?:" + historic.patientName + ", " + historic.examName)) {
        io.socket.delete("/historic/" + historic.id, function (data) {
          console.log(data);
          if (data) {
            var index = $scope.historics.indexOf(data);
            $scope.historics.splice(index);
            msg("Registro eliminado exitosamente", "", "success");
          } else {
            msg("No se pudo eliminar el registro", "", "warning");
          }
        });
      }
    };
    $scope.clarAll = function () {
      delete $scope.newHistoric.respApplication;
      delete $scope.newHistoric.cc;
      $scope.newHistoric.patient = {};
      $scope.newHistoric.company = {};
      $scope.newHistoric.exam = {};
      $scope.newHistoric.mutual = "Mutual";
      $scope.newHistoric.pooc = "OC";
      $scope.newHistoric.mutual = "Mutual";
      $scope.newHistoric.respApplication = "";
      $scope.newHistoric.cc = "";
      $scope.newHistoric.position = "";

      $("#patient_value").val("");
      $("#company_value").val("");
    };
    $scope.getHistorics = function () {
      console.log("getHistorics");
      io.socket.post("/historic/getAll", {date: $scope.newHistoric.registerDate}, function (data) {
        console.log(data);
        if (data.err) {
          msg('Problema al cargar historico', '', 'warning');
        } else {
          $scope.historics = data;
        }
        $scope.$apply();
      });
    };

    $scope.validateHistoric = function () {
      var state = true;
      if (!(_.isEmpty($scope.newHistoric.patient)
        || _.isEmpty($scope.newHistoric.exam)
        || _.isEmpty($scope.newHistoric.company))) {
        state = false;
      }

      return state;
    };

    $scope.filterName = function (historic) {
      if ($scope.filter.trim() === "")
        return true;
      var find = $scope.filter.toLowerCase();
      var searchFrace = historic.patientName.trim();
      searchFrace += (_.isUndefined(historic.patientSecondName) || _.isNull(historic.patientSecondName))
        ? "" : " " + historic.patientSecondName.trim();
      searchFrace += (_.isUndefined(historic.patientLastName) || _.isNull(historic.patientLastName))
        ? "" : " " + historic.patientLastName.trim();
      searchFrace += (_.isUndefined(historic.patientSecondLastName) || _.isNull(historic.patientSecondLastName)) ? "" : " " + historic.patientSecondLastName.trim();
      searchFrace = searchFrace.toLowerCase();
      return (searchFrace.indexOf(find) !== -1);
    };
    $scope.openNewPatient = function () {

      $('#createPatientModal').modal("show");

    };

    $scope.savePatient = function () {
      $scope.isSaving = true
      io.socket.post("/patient/create", {patient: $scope.newPatient}, function (data) {
        $scope.isSaving = false;
        if (data) {
          $scope.newHistoric.patient = $.extend($scope.newPatient, data);
          $("#patient_value").val(data.name + " " + data.lastName);
          msg("Paciente creado exitosamente", "", "success");
          $('#createPatientModal').modal("hide");
          $scope.newPatient = {};
          $scope.newPatient.error = false
        } else {
          $scope.newPatient.error = true;
          $scope.$apply($scope.newPatient)
          //msg("Paciente no se pudo creear", "", "danger");
        }
      });
    };

    $scope.openNewCompany = function () {
      $('#createCompanyModal').modal("show");
    };

    $scope.saveCompany = function () {

      $scope.isSaving = true;
      io.socket.post("/company/create", {company: $scope.newCompany}, function (data) {
        $scope.isSaving = false;
        if (data) {
          $scope.newHistoric.company = $.extend($scope.newCompany, data);
          $("#company_value").val(data.name + " " + data.rut);
          msg("Empresa creada exitosamente", "", "success");
          $('#createCompanyModal').modal("hide");
          $scope.newCompany = {};
          $scope.newCompany.error = false;
        } else {
          $scope.newCompany.error = true;
          $scope.$apply($scope.newCompany)
          //msg("Empresa no se pudo creear", "", "danger");
        }
      });
    };
    //Validation of all form for quitation
    $scope.validateHistoric = function () {
      var state = true;
      if (!(_.isEmpty($scope.newHistoric.patient)
        || _.isEmpty($scope.newHistoric.exam)
        || _.isEmpty($scope.newHistoric.company))) {
        state = false;
      }

      return state;
    }
  }
  ]);

