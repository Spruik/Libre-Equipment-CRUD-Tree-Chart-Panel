import * as utils from './utils'
let filter = []

export function updateNode (node, allData, panelCtrl) {
  let data = prepareModalData(node, allData)
  utils.showModal('update_node.html', data)
  removeListeners()
  addListeners(node, allData, panelCtrl)
}

/**
 * Update the reminder text based on the node's type
 * filter the distinct record of the same branch based on the node's type and push the value that match that type in the record to an array, this is for further validation purposes
 * @param {*} node 
 * @param {*} allData 
 */
function prepareModalData (node, allData) {

  let msg
  let self
  let maxlength = 50

  if (node.type === 'Site') {
    self = 'Site'
    filter = allData.filter(d => d.site !== null)
    filter = filter.reduce((arr, record) => {
      arr.push(record.site)
      return arr
    }, [])
  }else if (node.type === 'Area') {
    self = 'Area'
    filter = allData.filter(d => d.site === node.info.site && d.area !== null)
    filter = filter.reduce((arr, record) => {
      arr.push(record.area)
      return arr
    }, [])
  }else if (node.type === 'Line') {
    self = 'Line'
    filter = allData.filter(d => d.site === node.info.site && d.area === node.info.area && d.production_line !== null)
    filter = filter.reduce((arr, record) => {
      arr.push(record.production_line)
      return arr
    }, [])
  }else if (node.type === 'Equipment') {
    self = 'Equipment'
    filter = allData.filter(d => d.site === node.info.site && d.area === node.info.area && d.production_line === node.info.line && d.equipment !== null)
    filter = filter.reduce((arr, record) => {
      arr.push(record.equipment)
      return arr
    }, [])
  }

  filter = Array.from(new Set(filter))
  
  return {
    info: {self: self},
    inputVal: node.name,
    maxlength: maxlength
  }
}

function removeListeners () {
  $(document).off('click', '#master-data-reason-code-update-node-submitBtn')
}

function addListeners (node, allData, panelCtrl) {
  $(document).on('click', '#master-data-reason-code-update-node-submitBtn', e => {
    const input = $('#master-data-reason-code-update-node-form').serializeArray()[0].value
    if (isInputValid(input, node)) {
      //valid
      startUpdate(input, node, panelCtrl)
    }
  })
}

/**
 * Check if input is empty
 * Check if input has changed
 * Check if input is already exist within the same parent
 * @param {*} input 
 * @param {*} node 
 */
function isInputValid(input, node) {
  if (input === '') {
    utils.alert('warning', 'Warning', 'Input Required')
    return false
  }

  if (input === node.name) {
    utils.alert('warning', 'Warning', 'Change Required')
    return false
  }

  filter = filter.reduce((arr, d) => {
    arr.push(d.toLowerCase())
    return arr
  }, [])

  // console.log(filter);
  
  if (filter.indexOf(input.toLowerCase()) !== -1) {
    utils.alert('warning', 'Warning', node.type + ' exists')
    return false
  }

  return true
}

/**
 * Prepare urls and lines for the update
 * @param {*} input 
 * @param {*} node 
 * @param {*} panelCtrl 
 */
function startUpdate(input, node, panelCtrl) {
  if (input === node.parent) {
    utils.alert('warning', 'Warning', "The name cannot be the same as its parent's name")
    return
  }
  const url = utils.writeLine(node)
  const line = makeLine(input, node)
  normalUpdate(url, line, panelCtrl)
}

/**
 * Url will locate all records matching this url condition
 * Line is the update argument that is used to update all those records
 * popup successful, close the form, and refresh the tree when it's finished
 * popup error, close the form when it failed
 * @param {*} url 
 * @param {*} line 
 * @param {*} panelCtrl 
 */
function normalUpdate(url, line, panelCtrl) {
  utils.update(url, line).then(res => {
    // console.log(res)
    $('#master-data-reason-code-update-node-cancelBtn').trigger('click')
    utils.alert('success', 'Success', 'A new node has been succeesfully inserted')
    panelCtrl.refresh()
  }).catch(e => {
    // console.log(e)
    $('#master-data-reason-code-update-node-cancelBtn').trigger('click')
    utils.alert('error', 'Error', 'Error ocurred whiling inserting node into the database, please try agian')
  })
}

/**
 * Make the update line based on the node type.
 * @param {*} input 
 * @param {*} node 
 */
function makeLine(input, node){
  let l = ''
  if (node.type === 'Site') {
    l = 'site=' + input
  }else if (node.type === 'Area') {
    l = 'area=' + input
  }else if (node.type === 'Line') {
    l = 'production_line=' + input
  }else if (node.type === 'Equipment') {
    l = 'equipment=' + input
  }
  return l
}
