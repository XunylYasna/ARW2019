let ipcRenderer = require('electron').ipcRenderer

function saveMemberInformation (member_data) {
    ipcRenderer.send("members/add", member_data)
}