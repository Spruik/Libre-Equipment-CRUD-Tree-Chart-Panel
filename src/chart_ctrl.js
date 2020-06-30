import _ from 'lodash'
import $ from 'jquery'
import echarts from './libs/echarts.min'
import { MetricsPanelCtrl } from 'app/plugins/sdk'
import { tablePanelEditor } from './editor'
import { generateOption } from './tree_option'
import { getTreeStructureData } from './tree_convertor'
import { showCrudPopup } from './crud_ctrl'

import './css/style.css!'
import './css/input-fields.css!'

const panelDefaults = {
  targets: [{}],
  pageSize: null,
  showHeader: true,
  styles: [],
  columns: [],
  fontSize: '100%'
}

export class ChartCtrl extends MetricsPanelCtrl {
  constructor ($scope, $injector, templateSrv, annotationsSrv, $sanitize, variableSrv) {
    super($scope, $injector)

    this.pageIndex = 0

    if (this.panel.styles === void 0) {
      this.panel.styles = this.panel.columns
      this.panel.columns = this.panel.fields
      delete this.panel.columns
      delete this.panel.fields
    }

    _.defaults(this.panel, panelDefaults)

    this.events.on('data-received', this.onDataReceived.bind(this))
    this.events.on('data-error', this.onDataError.bind(this))
    this.events.on('data-snapshot-load', this.onDataReceived.bind(this))
    this.events.on('init-edit-mode', this.onInitEditMode.bind(this))

    this.hasData = false
    this.listData = []
  }

  onInitEditMode () {
    this.addEditorTab('Options', tablePanelEditor, 2)
  }

  issueQueries (datasource) {
    this.pageIndex = 0

    if (this.panel.transform === 'annotations') {
      this.setTimeQueryStart()
      return this.annotationsSrv
        .getAnnotations({
          dashboard: this.dashboard,
          panel: this.panel,
          range: this.range
        })
        .then(annotations => {
          return { data: annotations }
        })
    }

    return super.issueQueries(datasource)
  }

  onDataError () {
    this.dataRaw = []
    this.render()
  }

  onDataReceived (dataList) {
    if (dataList.length === 0 || dataList === null || dataList === undefined) {
      console.log('No data reveived')
      this.hasData = false
      return
    } else {
      this.hasData = true
    }

    if (dataList[0].type !== 'table') {
      console.log('To show the gantt chart, please format data as a TABLE in the Metrics Setting')
      return
    }

    const data = this.getRestructuredData(dataList[0].columns, dataList[0].rows)
    this.listData = data
    // convert list data to tree-structured data
    const treeData = getTreeStructureData(data)
    this.render(treeData, this.listData)
  }

  getRestructuredData (rawCols, rows) {
    const data = []
    const cols = rawCols.reduce((arr, c) => {
      const col = c.text.toLowerCase()
      arr.push(col)
      return arr
    }, [])
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      const serise = {}
      for (let k = 0; k < cols.length; k++) {
        const col = cols[k]
        serise[col] = row[k]
      }
      data.push(serise)
    }

    return data
  }

  rendering () {
    // this.render(this.globe_data)
  }

  link (scope, elem, attrs, ctrl) {
    const $panelContainer = elem.find('#equipment-tree')[0]
    const myChart = echarts.init($panelContainer)

    function renderPanel (data) {
      if (!myChart || !data) { return }
      const option = generateOption(data)
      // myChart.clear();
      myChart.off('mouseup')
      myChart.off('mousedown')
      myChart.setOption(option)
      setTimeout(() => {
        $('#equipment-tree').height(ctrl.height - 21)
        myChart.resize()
        window.onresize = () => {
          myChart.resize()
        }
      }, 500)
      // set long press listener below
      let pressTimer
      myChart.on('mouseup', params => {
        clearTimeout(pressTimer)
        // console.log(params);
        return false
      })
      myChart.on('mousedown', params => {
        pressTimer = window.setTimeout(function () {
          showCrudPopup(params.data, ctrl, ctrl.listData)
        }, 1200)
        return false
      })
    }

    ctrl.events.on('panel-size-changed', () => {
      if (myChart) {
        const height = ctrl.height - 21
        if (height >= 180) {
          $('#equipment-tree').height(height)
        }
        myChart.resize()
      }
    })

    ctrl.events.on('render', (data) => {
      renderPanel(data)
      ctrl.renderingCompleted()
    })
  }
}

ChartCtrl.templateUrl = 'public/plugins/libre-equipment-crud-tree-chart-panel/partials/module.html'
