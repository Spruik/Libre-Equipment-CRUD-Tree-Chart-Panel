'use strict';

System.register([], function (_export, _context) {
  "use strict";

  function generateOption(data) {
    var option = {
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
        formatter: function formatter(p) {
          var type = p.data.type;
          var parent = p.data.parent === null ? 'No parent' : p.data.parent;
          var tooltip = '<p style="text-align:center; background-color:#f7f7f7">' + p.name + '</p>';
          tooltip += 'Type : ' + type;
          tooltip += '<br />';
          tooltip += 'Parent : ' + parent;
          return tooltip;
        },
        backgroundColor: 'white',
        borderColor: 'lightgray',
        borderWidth: 0.5,
        textStyle: {
          color: 'black'
        }
      },
      series: [{
        type: 'tree',

        data: [data],

        top: '1%',
        left: '10%',
        bottom: '1%',
        right: '20%',

        symbolSize: 9,

        label: {
          normal: {
            position: 'left',
            verticalAlign: 'middle',
            align: 'right',
            fontSize: 10
          }
        },

        leaves: {
          label: {
            normal: {
              position: 'right',
              verticalAlign: 'middle',
              align: 'left'
            }
          }
        },

        expandAndCollapse: true,
        animationDuration: 500,
        animationDurationUpdate: 500
      }]
    };
    return option;
  }

  return {
    setters: [],
    execute: function () {
      _export('generateOption', generateOption);
    }
  };
});
//# sourceMappingURL=tree_option.js.map
