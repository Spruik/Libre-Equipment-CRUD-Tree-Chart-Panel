import _ from 'lodash'

export class TablePanelEditorCtrl {
  /** @ngInject */
  constructor ($scope, $q, uiSegmentSrv) {
    $scope.editor = this
    this.panelCtrl = $scope.ctrl
    this.panel = this.panelCtrl.panel
  }

  transformChanged () {
    this.panel.columns = []
    if (this.panel.transform === 'timeseries_aggregations') {
      this.panel.columns.push({ text: 'Avg', value: 'avg' })
    }

    this.updateTransformHints()
    this.render()
  }

  render () {
    console.log('hhh')
  }

  removeColumn (column) {
    this.panel.columns = _.without(this.panel.columns, column)
    this.panelCtrl.render()
  }
}

/** @ngInject */
export function tablePanelEditor ($q, uiSegmentSrv) {
  'use strict'
  return {
    restrict: 'E',
    scope: true,
    templateUrl: 'public/plugins/smart-factory-equipment-crud-tree-chart-panel/partials/editor.html',
    controller: TablePanelEditorCtrl
  }
}
