let {ipcRenderer} = require("electron")
let os = require('os')
let config = {
    apiKey: "AIzaSyDYYyY5glPzgTpaSfEh_uts6ScVCqMaZOs",
    authDomain: "lscs-1533439549946.firebaseapp.com",
    databaseURL: "https://lscs-1533439549946.firebaseio.com",
    projectId: "lscs-1533439549946",
    storageBucket: "lscs-1533439549946.appspot.com",
    messagingSenderId: "293713830858"
}

firebase.initializeApp(config)

$("#member_data").show()
let member_data = new Vue ({
    el: "#main",
    data: { 
        pc_name: os.hostname(),
        fields: {
            "timestamp": {
                name: "TIMESTAMP",
                calculate: function (value) {
                    return (new Date(value.timestamp)).toLocaleString()
                }
            },
            "id_number": {
                "name": "I.D. Number",
                "type": "number",
                "validate": function (value) {
                    if (!value) return false
                    try {
                        value = parseInt(value)
                        return true
                    } catch (e) {
                        return false
                    }
                },
                "message": "ID Number should be an integer."
            },
            "name": {
                name: "NAME",
                calculate: function (value) {
                    return (value.last_name + ", " + value.given_name + " " + value.middle_name + " ").toUpperCase()
                }
            },
            "membership_type": {
                name: "MEMBERSHIP TYPE",
                calculate: function (value) {
                    switch(value.membership_type) {
                        case "honorary":
                            return "Honorary"
                        case "groups_of_5_new":
                            return "Group of 5 New Members"
                        case "groups_of_5_old":
                            return "Group of 5 Old Members"
                        case "_old":
                            return "Old Member"
                        case "_new":
                            return "New Member"
                    }
                }
            },
            "course": {
                "name": "Course",
                "type": "single",
                "choices": [
                    "BSCS",
                    "BSIT",
                    "BSCS-ST",
                    "BSCS-NE",
                    "BSCS-IST",
                    "BSCS-CSE",
                    "BS-INSYS",
                    "IET-GD2",
                    "IET-AD2",
                    "IET-GDS",
                    "IET-ADS",
                    "CSS",
                    "BSMSCS"
                ], 
                "others": true,
                "validate": function (value, value_others) {
                    return value != "OTHERS" ? (value ? true : false) : value_others ? true : false
                },
                "message": "Course must not be empty."
            },
            "contact_number": {
                "name": "Contact Number",
                "type": "text",
                "message": "Contact number should be a number."
            },
            "email_address_dlsu": {
                "name": "DLSU Email",
                "type": "email",
                "validate": function (value) {
                    return value ? value.endsWith("@dlsu.edu.ph") : false
                },
                "calculate": function (value) {
                    return value.email_address_dlsu
                },
                "message": "Use your DLSU Google Mail account."
            },
            "officer": {
                "name": "Officer",
                "type": "boolean",
                "calculate": function (value) {
                    return value.officer  === "true" ? "Yes" : "No"
                },
                "message": "Please indicate if you are an officer or not."
            },"applied_for_jo": {
                "name": "JO",
                "type": "boolean",
                "calculate": function (value) {
                    return value.applied_for_jo ? "Yes" : "No"
                },
                "message": "Please indicate if you are an officer or not."
            },
        },
        fees: require('./../config/fees.json'),
        sorted: { column: 'timestamp', asc: true},
        members: [],
        filter_jo: false,
        data_samp: {}
    },
    created () {
		ipcRenderer.send('members')
    },
    methods: {
        count_jo: function () {
            let count = 0

            for (member in this.members) {
                count += this.filter_jo ? this.members[member] ? this.members[member].applied_for_jo ? 1 : 0 : 1 : 1
            }
            
            return count
        },
        sync: function () { 
            if (firebase) {
                let count = 0
                for (i in this.members) {
                    let status = this.sync_member(i, this.members[i])
                    if (status) count += 1
                }
                
                toast_container.toast(count + " members synced")
            } else  
                toast_container.toast("Firebase cannot sync, no internet!")
        },
        sync_member: function (i, member) {
            if (!member) 
                return false

            if (member.synced) 
                return false

			member.synced = true
            firebase.database().ref('members/' + member._id).set(member).then(function (error) {
                if (error) {
                   return toast_container.toast("Firebase cannot sync!")
                }

                ipcRenderer.send("members/update", i, member)
				Vue.set(member_data.members, i, member)
            })

            return true
        },
        delete_all: function () { },
        save: function () { 
            let date = new Date()
            ipcRenderer.send("members/save/arw", this.members)
        },
        sort: function (column) {
            if (column == this.sorted.column) 
                this.sorted.asc = !this.sorted.asc
            else
                this.sorted.asc = true
            this.sorted.column = column
            let sorted_final = this.sorted

            let calculate_func = this.fields[column].calculate ? this.fields[column].calculate : function (value) { return value[column] } 
            
            this.members.sort(function (a, b) {
                if      (calculate_func(a) > calculate_func(b)) return sorted_final.asc ?  -1 : 1
                else if (calculate_func(a) < calculate_func(b)) return sorted_final.asc ? 1 : -1
                return 0
            })
        },
        delete_member: function (member) {
            ipcRenderer.send("members/delete", member._id)
        }
    }
})

ipcRenderer.on("members/update", (event, args) => {
    switch (args[0]) {
		case 'GET':
			member_data.members = args[1] || []			
			member_data.members.sort(function (a, b) {
				if (a.timestamp > b.timestamp) { return -1 }
				else if (a.timestamp < b.timestamp) { return 1 }
				return 0
			})
			break;
        case 'INSERT':
            member_data.members.push(args[1])
            member_data.members.sort(function (a, b) {
                if (a.timestamp > b.timestamp) { return -1 }
                else if (a.timestamp < b.timestamp) { return 1 }
                return 0
            })
            toast_container.toast("Member #" + args[1].id_number + " added!")
            break;
        case 'DELETE':
            for (let i = 0; i < member_data.members.length; i++) {
                if (member_data.members[i]._id == args[1]) {
                    member_data.members.splice(i, 1)
                }
            }

            member_data.members.sort(function (a, b) {
                if (a.timestamp > b.timestamp) { return -1 }
                else if (a.timestamp < b.timestamp) { return 1 }
                return 0
            })
            toast_container.toast("Member #" + args[1] + " deleted!")
            break;
        case 'UPDATE':
            break

    }
})



