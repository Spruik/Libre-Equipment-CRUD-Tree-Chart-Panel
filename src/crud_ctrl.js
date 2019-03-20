import { addChild } from './add_child_ctrl'
import { updateNode } from './update_node_ctrl';
import * as utils from './utils'

export function showCrudPopup(data, panelCtrl, allData){
  
  utils.showModal('crud_options.html')
  removeListeners()
  addListeners(data, panelCtrl, allData)
}

function addListeners(data, panelCtrl, allData){
  $(document).on('click', 'input[type="button"][name="master-data-reason-code-actions-radio"]', e => {
    if (e.target.id === 'add') {
      //equipment is the last node, no chilren are allowed to be added to equipment
      if (data.type === 'Equipment') {
        utils.alert('warning', 'Warning', 'Adding child to Equipment is not allowed')
        $('#master-data-crud-options-form-dismiss-btn').trigger('click')
      }else {
        addChild(data, allData, panelCtrl)
      }
    }else if(e.target.id === 'update') {
      if (data.type === 'Root') {
        utils.alert('warning', 'Warning', 'The root is not updatable')
        $('#master-data-crud-options-form-dismiss-btn').trigger('click')
      }else {
        updateNode(data, allData, panelCtrl)
      }
    }else if(e.target.id === 'delete') {
      if (data.type === 'Root') {
        utils.alert('warning', 'Warning', 'The root is not deletable')
        $('#master-data-crud-options-form-dismiss-btn').trigger('click')
      }else {
        utils.showModal('delete_confirm.html')
      }
    }

  })

  $(document).on('click', '#master-data-reason-code-delete-confirmation-confirm-btn', e => {
    deleteNode(data, panelCtrl)
  })
}

function removeListeners(){
  $(document).off('click', 'input[type="button"][name="master-data-reason-code-actions-radio"]')
  $(document).off('click', '#master-data-reason-code-delete-confirmation-confirm-btn')
}

function deleteNode(node, panelCtrl){
  const url = utils.writeLine(node)
  if (url) {
    //http request
    utils.deleteMethod(url).then(res => {
      // console.log(res)
      $('#master-data-reason-code-delete-confirmation-cancel-btn').trigger('click')
      utils.alert('success', 'Deletion Success', 'The selected node and its children were successfully deleted')
      panelCtrl.refresh()
    }).catch(e => {
      // console.log(e);
      $('#master-data-reason-code-delete-confirmation-cancel-btn').trigger('click')
      utils.alert('error', 'Error', 'Error occurred while deleting the node from the database, please try agian')
    })
  }
}