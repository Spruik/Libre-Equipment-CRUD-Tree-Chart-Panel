'use strict';

System.register(['./utils', 'angular'], function (_export, _context) {
  "use strict";

  var alert, showModal, post, postgRestHost, utils, angular, filter, closeForm;
  function addChild(node, allData, panelCtrl) {
    var data = prepareModalData(node, allData);
    utils.showModal('add_child.html', data);
    removeListeners();
    addListeners(node, allData, panelCtrl);
  }

  _export('addChild', addChild);

  function prepareModalData(node, allData) {
    var sub = void 0,
        self = void 0;
    var placeholder = void 0;
    var maxLength = 12;
    console.log(allData);

    if (node.type === 'Root') {
      sub = 'Site';
      self = 'Root';
      placeholder = 'Enter a Site here';
      filter = allData.filter(function (d) {
        return d.site !== null;
      });
      filter = filter.reduce(function (arr, record) {
        arr.push(record.site);
        return arr;
      }, []);
    } else if (node.type === 'Site') {
      sub = 'Area';
      self = 'Site called ' + node.name;
      placeholder = 'Enter an Area here';
      filter = allData.filter(function (d) {
        return d.site !== null && d.area !== null && d.site === node.info.site;
      });
      filter = filter.reduce(function (arr, record) {
        arr.push(record.area);
        return arr;
      }, []);
    } else if (node.type === 'Area') {
      sub = 'Line';
      self = 'Area called ' + node.name;
      placeholder = 'Enter a Line here';
      filter = allData.filter(function (d) {
        return d.site !== null && d.site === node.info.site && d.area !== null && d.area === node.info.area && d.production_line !== null;
      });
      filter = filter.reduce(function (arr, record) {
        arr.push(record.production_line);
        return arr;
      }, []);
    } else if (node.type === 'Line') {
      sub = 'Equipment';
      self = 'Line called ' + node.name;
      placeholder = 'Enter an Equipment here';
      filter = allData.filter(function (d) {
        return d.equipment !== null && d.site === node.info.site && d.area === node.info.area && d.production_line === node.info.line;
      });
      filter = filter.reduce(function (arr, record) {
        arr.push(record.equipment);
        return arr;
      }, []);
    }

    filter = Array.from(new Set(filter));

    return {
      info: {
        child: sub,
        self: self
      },
      placeholder: placeholder,
      maxLength: maxLength
    };
  }

  function addListeners(node, allData, panelCtrl) {
    $(document).on('click', '#master-data-reason-code-add-child-submitBtn', function (e) {
      var input = $('#master-data-reason-code-add-child-form').serializeArray();
      if (input[0].value === '') {
        utils.alert('warning', 'Warning', 'Input Required');
      } else {
        if (isInputAvailable(input[0].value)) {
          insertNode(input[0].value, node, panelCtrl);
        }
      }
    });
  }

  function removeListeners() {
    $(document).off('click', '#master-data-reason-code-add-child-submitBtn');
  }

  /**
   * Check if the user input has already been exist in the same parent node.
   * @param {*} input
   */
  function isInputAvailable(input) {
    console.log(filter);
    filter = filter.reduce(function (arr, d) {
      arr.push(d.toLowerCase());
      return arr;
    }, []);

    if (filter.indexOf(input.toLowerCase()) !== -1) {
      utils.alert('warning', 'Warning', 'Child exists');
      return false;
    }

    return true;
  }

  function insertNode(input, node, panelCtrl) {
    if (input === node.name) {
      alert('warning', 'Warning', "The child node's name cannot be the same as its parent's name");
      return;
    }
    var line = writeInsertionLine(input, node);
    var url = postgRestHost + 'equipment';
    post(url, line).then(function (res) {
      // console.log(res)
      closeForm();
      utils.alert('success', 'Success', 'A new node has been succeesfully inserted');
      panelCtrl.refresh();
    }).catch(function (e) {
      // console.log(e);
      closeForm();
      utils.alert('error', 'Error', 'Error ocurred whiling inserting node into the database, please try agian');
    });
  }

  function writeInsertionLine(input, node) {
    var line = '';

    if (node.type === 'Root') {
      line = 'site=' + input;
    } else if (node.type === 'Site') {
      line = 'site=' + node.info.site + '&area=' + input;
    } else if (node.type === 'Area') {
      line = 'site=' + node.info.site + '&area=' + node.info.area + '&production_line=' + input;
    } else if (node.type === 'Line') {
      line = 'site=' + node.info.site + '&area=' + node.info.area + '&production_line=' + node.info.line + '&equipment=' + input;
    }

    return line;
  }
  return {
    setters: [function (_utils) {
      alert = _utils.alert;
      showModal = _utils.showModal;
      post = _utils.post;
      postgRestHost = _utils.postgRestHost;
      utils = _utils;
    }, function (_angular) {
      angular = _angular.default;
    }],
    execute: function () {
      filter = [];

      closeForm = function closeForm() {
        $('#master-data-reason-code-add-child-cancelBtn').trigger('click');
      };
    }
  };
});
//# sourceMappingURL=add_child_ctrl.js.map
