import { appEvents } from 'app/core/core'

const hostname = window.location.hostname
const protocol = window.location.protocol
export const postgRestHost = `${protocol}//${hostname}:5436/`
export const influxHost = `${protocol}//${hostname}:8086/`

export const post = (url, line) => {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    xhr.open('POST', url)
    xhr.onreadystatechange = handleResponse
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.onerror = e => reject(e)
    xhr.send(line)

    function handleResponse () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          // console.log('200');
          resolve(xhr.responseText)
        } else if (xhr.status === 204) {
          // console.log('204');
          resolve(xhr.responseText)
        } else if (xhr.status === 201) {
          resolve(xhr.responseText)
        } else {
          reject(xhr.responseText)
        }
      }
    }
  })
}

export const update = (url, line) => {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    xhr.open('PATCH', url)
    xhr.onreadystatechange = handleResponse
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.onerror = e => reject(e)
    xhr.send(line)

    function handleResponse () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          // console.log('200');
          resolve(xhr.responseText)
        } else if (xhr.status === 204) {
          // console.log('204');
          resolve(xhr.responseText)
        } else if (xhr.status === 201) {
          resolve(xhr.responseText)
        } else {
          reject(xhr.responseText)
        }
      }
    }
  })
}

export const deleteMethod = (url) => {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    xhr.open('DELETE', url)
    xhr.onreadystatechange = handleResponse
    xhr.onerror = e => reject(e)
    xhr.send()

    function handleResponse () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          // console.log('200');
          resolve(xhr.responseText)
        } else if (xhr.status === 204) {
          // console.log('204');
          resolve(xhr.responseText)
        } else {
          reject(this.statusText)
        }
      }
    }
  })
}

export const get = url => {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.onreadystatechange = handleResponse
    xhr.onerror = e => reject(e)
    xhr.send()

    function handleResponse () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var res = JSON.parse(xhr.responseText)
          resolve(res)
        } else {
          reject(this.statusText)
        }
      }
    }
  })
}

export const alert = (type, title, msg) => {
  appEvents.emit('alert-' + type, [title, msg])
}

export const showModal = (html, data) => {
  appEvents.emit('show-modal', {
    src: 'public/plugins/libre-equipment-crud-tree-chart-panel/partials/' + html,
    modalClass: 'confirm-modal',
    model: data
  })
}

export const writeLine = data => {
  let postgresUrl = postgRestHost + 'equipment?site=eq.' + data.info.site
  switch (data.type) {
    case 'Site': break
    case 'Area':
      postgresUrl += '&area=eq.' + data.info.area
      break
    case 'Line':
      postgresUrl += '&area=eq.' + data.info.area + '&production_line=eq.' + data.info.line
      break
    case 'Equipment':
      postgresUrl += '&area=eq.' + data.info.area + '&production_line=eq.' + data.info.line + '&equipment=eq.' + data.name
      break
    default:
      postgresUrl = null
      break
  }
  return postgresUrl
}

export const writeProductionLine = data => {
  let postgresUrl = postgRestHost + 'equipment?site=eq.' + data.info.site
  // + '&area=eq.' + rowData.Area + '&line=eq.' + rowData.Line
  switch (data.type) {
    case 'Site': break
    case 'Area':
      postgresUrl += '&area=eq.' + data.info.area
      break
    case 'Line':
      postgresUrl += '&area=eq.' + data.info.area + '&production_line=eq.' + data.info.line
      break
    default:
      postgresUrl = null
      break
  }
  return postgresUrl
}
