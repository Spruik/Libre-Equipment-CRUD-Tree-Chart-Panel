'use strict';

System.register([], function (_export, _context) {
  "use strict";

  /**
   * Expecting list of all data
   * Then first make a root, and sites
   * @param {*} data 
   */
  function getTreeStructureData(data) {
    //root
    var obj = {
      children: [],
      name: 'Bernatellos',
      type: 'Root',
      parent: null

      //take all sites out from an array of objects, find disctinct, and make those distinct values a new array of strings
    };var distinctSites = findDisctinct(data, 'site');
    for (var i = 0; i < distinctSites.length; i++) {
      var site = distinctSites[i];
      var ob = {
        name: site,
        children: [],
        // collapsed: false,
        type: 'Site',
        parent: obj.name,
        info: {
          site: site
        }
      };
      obj.children.push(ob);
    }

    return getAreas(obj, data);
  }

  /**
   * Expecting the tree structed obj, and the list structured array of objects
   * Add distinct areas to their matching sites
   * @param {*} obj 
   * @param {*} data 
   */

  _export('getTreeStructureData', getTreeStructureData);

  function getAreas(obj, data) {
    var _loop = function _loop(i) {
      var site = obj.children[i];
      //find areas that are under this site
      var areas = data.filter(function (d) {
        return d.area !== null && d.site === site.name;
      });
      //all areas to distinct areas
      var distinctAreas = findDisctinct(areas, 'area');
      //add each distinct area to this site
      for (var k = 0; k < distinctAreas.length; k++) {
        var area = distinctAreas[k];
        var ob = {
          name: area,
          children: [],
          collapsed: false,
          type: 'Area',
          parent: obj.children[i].name,
          info: {
            site: site.name,
            area: area
          }
        };
        obj.children[i].children.push(ob);
      }
    };

    //Under the mother root, for each sites
    for (var i = 0; i < obj.children.length; i++) {
      _loop(i);
    }
    return getLines(obj, data);
  }

  /**
   * Expecting the tree structed obj, and the list structured array of objects
   * Add distinct lines to their matching areas
   * @param {*} obj 
   * @param {*} data 
   */
  function getLines(obj, data) {
    for (var i = 0; i < obj.children.length; i++) {
      var _site = obj.children[i];

      var _loop2 = function _loop2(k) {
        var area = obj.children[i].children[k];
        var lines = data.filter(function (d) {
          return d.production_line !== null && d.area === area.name && d.site === area.parent;
        });
        var distinctLines = findDisctinct(lines, 'line');
        for (var l = 0; l < distinctLines.length; l++) {
          var line = distinctLines[l];
          var ob = {
            name: line,
            children: [],
            collapsed: false,
            type: 'Line',
            parent: obj.children[i].children[k].name,
            info: {
              site: _site.name,
              area: area.name,
              line: line
            }
          };
          obj.children[i].children[k].children.push(ob);
        }
      };

      for (var k = 0; k < _site.children.length; k++) {
        _loop2(k);
      }
    }
    return getEquiment(obj, data);
  }

  /**
  * Expecting the tree structed obj, and the list structured array of objects
  * Add distinct lines to their matching areas
  * @param {*} obj 
  * @param {*} data 
  */
  function getEquiment(obj, data) {
    for (var i = 0; i < obj.children.length; i++) {
      var _site2 = obj.children[i];

      var _loop3 = function _loop3(k) {
        var area = _site2.children[k];

        var _loop4 = function _loop4(e) {
          var line = area.children[e];
          var equipment = data.filter(function (d) {
            return d.equipment !== null && d.production_line === line.name && d.area === area.name && d.site === area.parent;
          });
          var disctinctEquipment = findDisctinct(equipment, 'equipment');
          for (var l = 0; l < disctinctEquipment.length; l++) {
            var equip = disctinctEquipment[l];
            var ob = {
              name: equip,
              children: [],
              collapsed: false,
              type: 'Equipment',
              parent: line.name,
              info: {
                site: _site2.name,
                area: area.name,
                line: line.name,
                equipment: equip
              }
            };
            obj.children[i].children[k].children[e].children.push(ob);
          }
        };

        for (var e = 0; e < area.children.length; e++) {
          _loop4(e);
        }
      };

      for (var k = 0; k < _site2.children.length; k++) {
        _loop3(k);
      }
    }
    return obj;
  }

  /**
  * Expecting an array of objects, and a string of keyword
  * Based on different attributes keywords passed in
  * Return an array of distinct and keyword-matching values of the array of objects
  * @param {*} arrObj 
  * @param {*} s 
  */
  function findDisctinct(arrObj, s) {
    var areaArr = arrObj.reduce(function (arr, record) {
      if (s === 'site') {
        arr.push(record.site);
      } else if (s === 'area') {
        arr.push(record.area);
      } else if (s === 'line') {
        arr.push(record.production_line);
      } else if (s === 'equipment') {
        arr.push(record.equipment);
      }
      return arr;
    }, []);
    return Array.from(new Set(areaArr));
  }return {
    setters: [],
    execute: function () {}
  };
});
//# sourceMappingURL=tree_convertor.js.map
