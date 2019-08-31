let toast_container = new Vue ({
    el: "#toast_container",
    data: {
        messages: []
    },
    methods: {
        toast (message, time) {
            let messages_final = this.messages
            let to_remove = this.messages.length
            let message_obj = {message, id: to_remove, timestamp: (new Date()).toLocaleString()}
            this.messages.push(message_obj)
            cancel = this.cancelToast
            setInterval(function() {
                cancel(message_obj)
            }, time?time:5000)
        },
        cancelToast (message) {
            this.messages.splice(message.id, 1)
        }
    }
})