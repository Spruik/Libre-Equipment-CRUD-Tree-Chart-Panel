  /**
   * Expecting list of all data
   * Then first make a root, and sites
   * @param {*} data 
   */
  export function getTreeStructureData(data){
    //root
    let obj = {
      children: [],
      name: 'Bernatellos',
      type: 'Root',
      parent: null
    }

    //take all sites out from an array of objects, find disctinct, and make those distinct values a new array of strings
    const distinctSites = findDisctinct(data, 'site')
    for (let i = 0; i < distinctSites.length; i++) {
      const site = distinctSites[i];
      let ob = {
        name: site,
        children: [], 
        // collapsed: false,
        type: 'Site', 
        parent: obj.name,
        info:{
            site: site
        }
      }
      obj.children.push(ob)
    }

    return getAreas(obj, data)
  }

  /**
   * Expecting the tree structed obj, and the list structured array of objects
   * Add distinct areas to their matching sites
   * @param {*} obj 
   * @param {*} data 
   */
  function getAreas(obj, data){
    //Under the mother root, for each sites
    for (let i = 0; i < obj.children.length; i++) {
      const site = obj.children[i];
      //find areas that are under this site
      const areas = data.filter(d => d.area !== null && d.site === site.name)
      //all areas to distinct areas
      const distinctAreas = findDisctinct(areas, 'area')
      //add each distinct area to this site
      for (let k = 0; k < distinctAreas.length; k++) {
        const area = distinctAreas[k];
        let ob = {
          name: area, 
          children: [], 
          collapsed: false,
          type: 'Area', 
          parent: obj.children[i].name,
          info: {
            site: site.name,
            area: area
          }
        }
        obj.children[i].children.push(ob)
      }
    }
    return getLines(obj, data)
  }

  /**
   * Expecting the tree structed obj, and the list structured array of objects
   * Add distinct lines to their matching areas
   * @param {*} obj 
   * @param {*} data 
   */
  function getLines(obj, data){
    for (let i = 0; i < obj.children.length; i++) {
      const site = obj.children[i];
      for (let k = 0; k < site.children.length; k++) {
        const area = obj.children[i].children[k];
        const lines = data.filter(d => d.production_line !== null && d.area === area.name && d.site === area.parent)
        const distinctLines = findDisctinct(lines, 'line')
        for (let l = 0; l < distinctLines.length; l++) {
          const line = distinctLines[l];
          let ob = {
            name: line,
            children: [], 
            collapsed: false,
            type: 'Line', 
            parent: obj.children[i].children[k].name,
            info: {
              site: site.name,
              area: area.name,
              line: line
            }
          }
          obj.children[i].children[k].children.push(ob)
        }
      }
    }
    return getEquiment(obj, data)
  }

    /**
   * Expecting the tree structed obj, and the list structured array of objects
   * Add distinct lines to their matching areas
   * @param {*} obj 
   * @param {*} data 
   */
  function getEquiment(obj, data){
    for (let i = 0; i < obj.children.length; i++) {
      const site = obj.children[i];
      for (let k = 0; k < site.children.length; k++) {
        const area = site.children[k];
        for (let e = 0; e < area.children.length; e++) {
          const line = area.children[e];
          const equipment = data.filter(d => d.equipment !== null && d.production_line === line.name && d.area === area.name && d.site === area.parent)
          const disctinctEquipment = findDisctinct(equipment, 'equipment')
          for (let l = 0; l < disctinctEquipment.length; l++) {
            const equip = disctinctEquipment[l];
            let ob = {
              name: equip,
              children: [], 
              collapsed: false,
              type: 'Equipment', 
              parent: line.name,
              info: {
                site: site.name,
                area: area.name,
                line: line.name,
                equipment: equip
              }
            }
            obj.children[i].children[k].children[e].children.push(ob)
          }
        }
      }
    }
    return obj
  }

    /**
   * Expecting an array of objects, and a string of keyword
   * Based on different attributes keywords passed in
   * Return an array of distinct and keyword-matching values of the array of objects
   * @param {*} arrObj 
   * @param {*} s 
   */
  function findDisctinct(arrObj, s){
    const areaArr = arrObj.reduce((arr, record) => {
      if (s === 'site') {
        arr.push(record.site)
      }else if (s === 'area'){
        arr.push(record.area)
      }else if (s === 'line') {
        arr.push(record.production_line)
      }else if (s === 'equipment') {
        arr.push(record.equipment)
      }
      return arr
    }, [])
    return Array.from(new Set(areaArr))
  }