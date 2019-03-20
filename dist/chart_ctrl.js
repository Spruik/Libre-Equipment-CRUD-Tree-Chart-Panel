'use strict';

System.register(['lodash', 'jquery', './libs/echarts.min', 'app/plugins/sdk', './editor', './tree_option', './tree_convertor', './crud_ctrl', './css/style.css!', './css/input-fields.css!'], function (_export, _context) {
  "use strict";

  var _, $, echarts, MetricsPanelCtrl, tablePanelEditor, generateOption, getTreeStructureData, showCrudPopup, _createClass, _get, panelDefaults, ChartCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  return {
    setters: [function (_lodash) {
      _ = _lodash.default;
    }, function (_jquery) {
      $ = _jquery.default;
    }, function (_libsEchartsMin) {
      echarts = _libsEchartsMin.default;
    }, function (_appPluginsSdk) {
      MetricsPanelCtrl = _appPluginsSdk.MetricsPanelCtrl;
    }, function (_editor) {
      tablePanelEditor = _editor.tablePanelEditor;
    }, function (_tree_option) {
      generateOption = _tree_option.generateOption;
    }, function (_tree_convertor) {
      getTreeStructureData = _tree_convertor.getTreeStructureData;
    }, function (_crud_ctrl) {
      showCrudPopup = _crud_ctrl.showCrudPopup;
    }, function (_cssStyleCss) {}, function (_cssInputFieldsCss) {}],
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

      _get = function get(object, property, receiver) {
        if (object === null) object = Function.prototype;
        var desc = Object.getOwnPropertyDescriptor(object, property);

        if (desc === undefined) {
          var parent = Object.getPrototypeOf(object);

          if (parent === null) {
            return undefined;
          } else {
            return get(parent, property, receiver);
          }
        } else if ("value" in desc) {
          return desc.value;
        } else {
          var getter = desc.get;

          if (getter === undefined) {
            return undefined;
          }

          return getter.call(receiver);
        }
      };

      panelDefaults = {
        targets: [{}],
        pageSize: null,
        showHeader: true,
        styles: [],
        columns: [],
        fontSize: '100%'
      };

      _export('ChartCtrl', ChartCtrl = function (_MetricsPanelCtrl) {
        _inherits(ChartCtrl, _MetricsPanelCtrl);

        function ChartCtrl($scope, $injector, templateSrv, annotationsSrv, $sanitize, variableSrv) {
          _classCallCheck(this, ChartCtrl);

          var _this = _possibleConstructorReturn(this, (ChartCtrl.__proto__ || Object.getPrototypeOf(ChartCtrl)).call(this, $scope, $injector));

          _this.pageIndex = 0;

          if (_this.panel.styles === void 0) {
            _this.panel.styles = _this.panel.columns;
            _this.panel.columns = _this.panel.fields;
            delete _this.panel.columns;
            delete _this.panel.fields;
          }

          _.defaults(_this.panel, panelDefaults);

          _this.events.on('data-received', _this.onDataReceived.bind(_this));
          _this.events.on('data-error', _this.onDataError.bind(_this));
          _this.events.on('data-snapshot-load', _this.onDataReceived.bind(_this));
          _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));

          _this.hasData = false;
          _this.listData = [];

          return _this;
        }

        _createClass(ChartCtrl, [{
          key: 'onInitEditMode',
          value: function onInitEditMode() {
            this.addEditorTab('Options', tablePanelEditor, 2);
          }
        }, {
          key: 'issueQueries',
          value: function issueQueries(datasource) {
            this.pageIndex = 0;

            if (this.panel.transform === 'annotations') {
              this.setTimeQueryStart();
              return this.annotationsSrv.getAnnotations({
                dashboard: this.dashboard,
                panel: this.panel,
                range: this.range
              }).then(function (annotations) {
                return { data: annotations };
              });
            }

            return _get(ChartCtrl.prototype.__proto__ || Object.getPrototypeOf(ChartCtrl.prototype), 'issueQueries', this).call(this, datasource);
          }
        }, {
          key: 'onDataError',
          value: function onDataError(err) {
            this.dataRaw = [];
            this.render();
          }
        }, {
          key: 'onDataReceived',
          value: function onDataReceived(dataList) {

            if (dataList.length === 0 || dataList === null || dataList === undefined) {
              console.log('No data reveived');
              this.hasData = false;
              return;
            } else {
              this.hasData = true;
            }

            if (dataList[0].type !== 'table') {
              console.log('To show the gantt chart, please format data as a TABLE in the Metrics Setting');
              return;
            }

            var data = this.getRestructuredData(dataList[0].columns, dataList[0].rows);
            this.listData = data;
            //convert list data to tree-structured data
            var treeData = getTreeStructureData(data);
            this.render(treeData, this.listData);
          }
        }, {
          key: 'getRestructuredData',
          value: function getRestructuredData(rawCols, rows) {

            var data = [];
            var cols = rawCols.reduce(function (arr, c) {
              var col = c.text.toLowerCase();
              arr.push(col);
              return arr;
            }, []);
            for (var i = 0; i < rows.length; i++) {
              var row = rows[i];
              var serise = {};
              for (var k = 0; k < cols.length; k++) {
                var col = cols[k];
                serise[col] = row[k];
              }
              data.push(serise);
            }

            return data;
          }
        }, {
          key: 'rendering',
          value: function rendering() {
            // this.render(this.globe_data)
          }
        }, {
          key: 'link',
          value: function link(scope, elem, attrs, ctrl) {
            var $panelContainer = elem.find('#equipment-tree')[0];
            var myChart = echarts.init($panelContainer);

            function renderPanel(data) {
              if (!myChart || !data) {
                return;
              }
              var option = generateOption(data);
              //   myChart.clear();
              myChart.off('mouseup');
              myChart.off('mousedown');
              myChart.setOption(option);
              setTimeout(function () {
                $('#equipment-tree').height(ctrl.height - 21);
                myChart.resize();
                window.onresize = function () {
                  myChart.resize();
                };
              }, 500);

              //set long press listener below
              var pressTimer = void 0;
              myChart.on('mouseup', function (params) {
                clearTimeout(pressTimer);
                // console.log(params);
                return false;
              });
              myChart.on('mousedown', function (params) {
                pressTimer = window.setTimeout(function () {
                  //code here
                  showCrudPopup(params.data, ctrl, ctrl.listData);
                }, 1200);
                return false;
              });
            }

            ctrl.events.on('panel-size-changed', function () {
              if (myChart) {
                var height = ctrl.height - 21;
                if (height >= 180) {
                  $('#equipment-tree').height(height);
                }
                myChart.resize();
              }
            });

            ctrl.events.on('render', function (data) {
              renderPanel(data);
              ctrl.renderingCompleted();
            });
          }
        }]);

        return ChartCtrl;
      }(MetricsPanelCtrl));

      _export('ChartCtrl', ChartCtrl);

      ChartCtrl.templateUrl = './partials/module.html';
    }
  };
});
//# sourceMappingURL=chart_ctrl.js.map
