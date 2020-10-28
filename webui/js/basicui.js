/**
 * This is the main JS file for the UI.
 */

//execute all code after the dom is loaded.
document.addEventListener("DOMContentLoaded", function (event) {

    let testArea = document.querySelector("#testing-area")
    // lets put a test button in the test area.
    let testButton = document.createElement('input')
    testButton.type = 'button'
    testButton.id = 'modal-test'
    testButton.value = 'Test Modals'
    testArea.append(testButton)

    // handler for the modal test button
    testButton.addEventListener('click', event => {
        event.preventDefault()
        console.log("User clicked the test modal button.")

        // now config & display the modal dialog.
        let titleH2 = document.querySelector('.modal__title')
        titleH2.innerHTML = 'Testing Modal Dialog and panels.'

        // put a message in the config panel.
        let appConfig = document.querySelector("#app-config")
        appConfig.style.display = 'block'
        appConfig.innerHTML = "We are just testing here..."

        // hide the editor panel
        let appEditor = document.querySelector("#app-editor")
        appEditor.style.display = 'none'
        // hide the Other/Aux panel
        let appOther = document.querySelector("#app-other")
        appOther.style.display = 'none'

        // hide the close button.
        let closeButton = document.querySelector("#modal-1-close")
        closeButton.style.display = 'none'

        //show the modal.
        MicroModal.show('modal-1')

    })




});
