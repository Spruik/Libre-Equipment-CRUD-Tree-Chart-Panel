import * as utils from './utils'

let filter = []

const closeForm = () => {
  $('#master-data-reason-code-add-child-cancelBtn').trigger('click')
}

export function addChild (node, allData, panelCtrl) {
  const data = prepareModalData(node, allData)
  utils.showModal('add_child.html', data)
  removeListeners()
  addListeners(node, allData, panelCtrl)
}

function prepareModalData (node, allData) {
  let sub, self
  let placeholder
  const maxLength = 12
  // console.log(allData);

  if (node.type === 'Root') {
    sub = 'Site'
    self = 'Root'
    placeholder = 'Enter a Site here'
    filter = allData.filter(d => d.site !== null)
    filter = filter.reduce((arr, record) => {
      arr.push(record.site)
      return arr
    }, [])
  } else if (node.type === 'Site') {
    sub = 'Area'
    self = 'Site called ' + node.name
    placeholder = 'Enter an Area here'
    filter = allData.filter(d => d.site !== null && d.area !== null && d.site === node.info.site)
    filter = filter.reduce((arr, record) => {
      arr.push(record.area)
      return arr
    }, [])
  } else if (node.type === 'Area') {
    sub = 'Line'
    self = 'Area called ' + node.name
    placeholder = 'Enter a Line here'
    filter = allData.filter(d => d.site !== null && d.site === node.info.site && d.area !== null && d.area === node.info.area && d.production_line !== null)
    filter = filter.reduce((arr, record) => {
      arr.push(record.production_line)
      return arr
    }, [])
  } else if (node.type === 'Line') {
    sub = 'Equipment'
    self = 'Line called ' + node.name
    placeholder = 'Enter an Equipment here'
    filter = allData.filter(d => d.equipment !== null && d.site === node.info.site && d.area === node.info.area && d.production_line === node.info.line)
    filter = filter.reduce((arr, record) => {
      arr.push(record.equipment)
      return arr
    }, [])
  }

  filter = Array.from(new Set(filter))

  return {
    info: {
      child: sub,
      self: self
    },
    placeholder: placeholder,
    maxLength: maxLength
  }
}

function addListeners (node, allData, panelCtrl) {
  $(document).on('click', '#master-data-reason-code-add-child-submitBtn', e => {
    const input = $('#master-data-reason-code-add-child-form').serializeArray()
    if (input[0].value === '') {
      utils.alert('warning', 'Warning', 'Input Required')
    } else {
      if (isInputAvailable(input[0].value)) {
        insertNode(input[0].value, node, panelCtrl)
      }
    }
  })
}

function removeListeners () {
  $(document).off('click', '#master-data-reason-code-add-child-submitBtn')
}

/**
 * Check if the user input has already been exist in the same parent node.
 * @param {*} input
 */
function isInputAvailable (input) {
  // console.log(filter);
  filter = filter.reduce((arr, d) => {
    arr.push(d.toLowerCase())
    return arr
  }, [])

  if (filter.indexOf(input.toLowerCase()) !== -1) {
    utils.alert('warning', 'Warning', 'Child exists')
    return false
  }

  return true
}

function insertNode (input, node, panelCtrl) {
  if (input === node.name) {
    utils.alert('warning', 'Warning', "The child node's name cannot be the same as its parent's name")
    return
  }
  const line = writeInsertionLine(input, node)
  const url = utils.postgRestHost + 'equipment'
  utils.post(url, line)
    .then(res => {
      // console.log(res)
      closeForm()
      utils.alert('success', 'Success', 'A new node has been succeesfully inserted')
      panelCtrl.refresh()
    })
    .catch(e => {
      // console.log(e);
      closeForm()
      utils.alert(
        'error',
        'Error',
        'Error ocurred whiling inserting node into the database, please try agian'
      )
    })
}

function writeInsertionLine (input, node) {
  let line = ''

  if (node.type === 'Root') {
    line = 'site=' + input
  } else if (node.type === 'Site') {
    line = 'site=' + node.info.site + '&area=' + input
  } else if (node.type === 'Area') {
    line = 'site=' + node.info.site + '&area=' + node.info.area + '&production_line=' + input
  } else if (node.type === 'Line') {
    line = 'site=' + node.info.site + '&area=' + node.info.area + '&production_line=' + node.info.line + '&equipment=' + input
  }
  return line
}
