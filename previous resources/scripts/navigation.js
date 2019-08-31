let sections = document.getElementsByClassName("section")
let modals = document.getElementsByClassName("modal")
let currentSection = "home"

function transitionSection (str) {
    hideCurrentSection(showSection, str)
}

function showSection (str) {
    if (sections[str]) {
        currentSection = str
        $(sections[str]).fadeIn(300)
    }
}

function hideCurrentSection (callback, str) {
    if (sections[currentSection]) {
        $(sections[currentSection]).fadeOut(300, () => callback(str))
        return
    }

    callback(str)
}

function showModal (str) {
    if (modals[str]) {
        currentModal = str
        $(modals[str]).css('display', 'flex').hide().fadeIn(300)
        $("body").css('overflow', 'hidden')
    }
}

function closeCurrentModal (callback) {
    if (modals[currentModal]) {
        $(modals[currentModal]).fadeOut(300)
        $("body").css('overflow', 'auto')
        if (callback)
            callback()
    }
}
