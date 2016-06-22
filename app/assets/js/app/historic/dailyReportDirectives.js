angular.module('dailyReportModule').directive('validar', [function () {
        return {
            require: '?ngModel',
            link: function (scope, elem, attrs, ctrl) {
                if (!ctrl)
                    return;

                function decimalPlaces(num) {
                    var match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
                    if (!match) {
                        return 0;
                    }
                    return Math.max(
                            0,
                            // Number of digits right of decimal point.
                                    (match[1] ? match[1].length : 0)
                                    // Adjust for scientific notation.
                                    - (match[2] ? +match[2] : 0));
                }

                elem.bind('keyup', function (event) {
                    var valor = elem.val();
                    var min = parseInt(attrs.min);
                    var max = parseInt(attrs.max);
                    var reemplazarValor = false;
                    if (decimalPlaces(valor + "") > 2) {
                        reemplazarValor = true;
                        valor = parseFloat(parseFloat(valor + "").toFixed(2));
                    }

                    if (valor < min) {
                        reemplazarValor = true;
                        valor = min;
                    }
                    if (valor > max) {
                        reemplazarValor = true;
                        valor = max;
                    }
                    if (reemplazarValor)
                        elem.val(valor);
                });
//
//                ctrl.$parsers.push(function (val) {
//                    var plainNumber = val.replace(/\./g, '').replace(',', '.').replace(/[^\d|\-+|\.+]/g, '') * 1;
//                    if (isNaN(plainNumber))
//                        return 0;
//                    return plainNumber;
//                });
            }
        };
    }]);