'use strict';

System.register(['./add_child_ctrl', './update_node_ctrl', './utils'], function (_export, _context) {
  "use strict";

  var addChild, updateNode, utils;
  function showCrudPopup(data, panelCtrl, allData) {

    utils.showModal('crud_options.html');
    removeListeners();
    addListeners(data, panelCtrl, allData);
  }

  _export('showCrudPopup', showCrudPopup);

  function addListeners(data, panelCtrl, allData) {
    $(document).on('click', 'input[type="button"][name="master-data-reason-code-actions-radio"]', function (e) {
      if (e.target.id === 'add') {
        //equipment is the last node, no chilren are allowed to be added to equipment
        if (data.type === 'Equipment') {
          utils.alert('warning', 'Warning', 'Adding child to Equipment is not allowed');
          $('#master-data-crud-options-form-dismiss-btn').trigger('click');
        } else {
          addChild(data, allData, panelCtrl);
        }
      } else if (e.target.id === 'update') {
        if (data.type === 'Root') {
          utils.alert('warning', 'Warning', 'The root is not updatable');
          $('#master-data-crud-options-form-dismiss-btn').trigger('click');
        } else {
          updateNode(data, allData, panelCtrl);
        }
      } else if (e.target.id === 'delete') {
        if (data.type === 'Root') {
          utils.alert('warning', 'Warning', 'The root is not deletable');
          $('#master-data-crud-options-form-dismiss-btn').trigger('click');
        } else {
          utils.showModal('delete_confirm.html');
        }
      }
    });

    $(document).on('click', '#master-data-reason-code-delete-confirmation-confirm-btn', function (e) {
      deleteNode(data, panelCtrl);
    });
  }

  function removeListeners() {
    $(document).off('click', 'input[type="button"][name="master-data-reason-code-actions-radio"]');
    $(document).off('click', '#master-data-reason-code-delete-confirmation-confirm-btn');
  }

  function deleteNode(node, panelCtrl) {
    var url = utils.writeLine(node);
    if (url) {
      //http request
      utils.deleteMethod(url).then(function (res) {
        // console.log(res)
        $('#master-data-reason-code-delete-confirmation-cancel-btn').trigger('click');
        utils.alert('success', 'Deletion Success', 'The selected node and its children were successfully deleted');
        panelCtrl.refresh();
      }).catch(function (e) {
        // console.log(e);
        $('#master-data-reason-code-delete-confirmation-cancel-btn').trigger('click');
        utils.alert('error', 'Error', 'Error occurred while deleting the node from the database, please try agian');
      });
    }
  }
  return {
    setters: [function (_add_child_ctrl) {
      addChild = _add_child_ctrl.addChild;
    }, function (_update_node_ctrl) {
      updateNode = _update_node_ctrl.updateNode;
    }, function (_utils) {
      utils = _utils;
    }],
    execute: function () {}
  };
});
//# sourceMappingURL=crud_ctrl.js.map
