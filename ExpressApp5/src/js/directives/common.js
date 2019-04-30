let PhFilter = () => {
  return {
    restrict: "E",
    scope: {
      conditions: "=",
      fields: "=",
      onSelect: "&"
    },
    template: require('./filter.html'),
    link: function (scope, element, attrs) {
      scope.compList = [
        {
          val: "eq",
          label: "равно"
        },
        {
          val: "neq",
          label: "не равно"
        },
        {
          val: "cn",
          label: "содержит"
        },
        {
          val: "ncn",
          label: "не содержит"
        },
        {
          val: "nl",
          label: "пусто"
        },
        {
          val: "nnl",
          label: "не пусто"
        },
        {
          val: "gt",
          label: "больше"
        },
        {
          val: "lt",
          label: "меньше"
        },
        {
          val: "ls",
          label: "в списке"
        },
        {
          val: "nls",
          label: "не в списке"
        }
      ];
      scope.showCondition = function (value, cond) {
        if (['gt', 'lt'].indexOf(value) === -1 || !cond.field) {
          return true;
        }
        return cond.type === 'number';
      };

      scope.changeField = function ($index) {
        let condition = scope.conditions[$index];
        let found = scope.fields.filter(function (item) {
          return item.field === condition.field;
        })[0];
        condition.type = found.type;
      };

      scope.changeCondition = function ($index) {
        let condition = scope.conditions[$index];
        if (["ls", "nls"].indexOf(condition.cond) > -1) {
          if (typeof condition.val === 'string') {
            condition.val = [condition.val];
          }
        } else if (Array.isArray(condition.val)) {
          condition.val = condition.val.length ? condition.val[0] : "";
        }
      };

      scope.ondelcond = function ($index) {
        scope.conditions.splice($index, 1);
      };

      scope.onaddcond = function () {
        scope.conditions.push({ field: '', cond: '', val: '' });
      }

    }
  }
};

let CustomOnChange = () => {
  return {
    restrict: 'A',
    scope: {
      customOnChange: '&'
    },
    link: function (scope, element, attrs) {
      element.on('change', function (e) {
        scope.$apply(function () {
          scope.customOnChange({files: e.target.files});
        });
      });
      element.on('$destroy', function() {
        element.off();
      });
    }
  };
};

let Loading = () => {
  return {
    restrict: 'A',
    scope: {
      loading: '='
    },
    template: '<div ng-if="loading"><i class="fa fa-spinner fa-spin"></i>Загрузка ...</div>'
  };
};

let AbsoluteLoading = () => {
  return {
    restrict: 'E',
    template: require('./absolute-loading.html')
  };
};


module.exports = {PhFilter, CustomOnChange, Loading, AbsoluteLoading};
