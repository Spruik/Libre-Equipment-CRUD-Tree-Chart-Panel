'use strict';

System.register(['lodash'], function (_export, _context) {
  "use strict";

  var _, _createClass, TablePanelEditorCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  /** @ngInject */
  function tablePanelEditor($q, uiSegmentSrv) {
    'use strict';

    return {
      restrict: 'E',
      scope: true,
      templateUrl: 'public/plugins/smart-factory-equipment-crud-tree-chart-panel/partials/editor.html',
      controller: TablePanelEditorCtrl
    };
  }

  _export('tablePanelEditor', tablePanelEditor);

  return {
    setters: [function (_lodash) {
      _ = _lodash.default;
    }],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _export('TablePanelEditorCtrl', TablePanelEditorCtrl = function () {
        /** @ngInject */
        function TablePanelEditorCtrl($scope, $q, uiSegmentSrv) {
          _classCallCheck(this, TablePanelEditorCtrl);

          $scope.editor = this;
          this.panelCtrl = $scope.ctrl;
          this.panel = this.panelCtrl.panel;
        }

        _createClass(TablePanelEditorCtrl, [{
          key: 'transformChanged',
          value: function transformChanged() {
            this.panel.columns = [];
            if (this.panel.transform === 'timeseries_aggregations') {
              this.panel.columns.push({ text: 'Avg', value: 'avg' });
            }

            this.updateTransformHints();
            this.render();
          }
        }, {
          key: 'render',
          value: function render() {
            console.log('hhh');
          }
        }, {
          key: 'removeColumn',
          value: function removeColumn(column) {
            this.panel.columns = _.without(this.panel.columns, column);
            this.panelCtrl.render();
          }
        }]);

        return TablePanelEditorCtrl;
      }());

      _export('TablePanelEditorCtrl', TablePanelEditorCtrl);
    }
  };
});
//# sourceMappingURL=editor.js.map
