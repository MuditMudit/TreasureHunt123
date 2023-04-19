class DragAndDrop {
    constructor(dropZone1Selector, dropZone2Selector, dropZone3Selector, textBoxSelector, dragDropContainerSelector) {
        this.dropZone1 = document.querySelector(dropZone1Selector);
        this.dropZone2 = document.querySelector(dropZone2Selector);
        this.dropZone3 = document.querySelector(dropZone3Selector);
        this.textBox = document.querySelector(textBoxSelector);
        this.dragDropContainer = document.querySelector(dragDropContainerSelector);

        this.initialize();
    }

    initialize() {
        const dragDropItems = document.querySelectorAll('.drag-drop-item');

        dragDropItems.forEach((item) => {
            item.addEventListener('dragstart', (event) => {
                event.dataTransfer.setData('text/plain', event.target.alt);
            });
        });

        this.dropZone1.addEventListener('dragover', (event) => {
            event.preventDefault();
        });

        this.dropZone2.addEventListener('dragover', (event) => {
            event.preventDefault();
        });

        this.dropZone3.addEventListener('dragover', (event) => {
            event.preventDefault();
        });

        this.dropZone1.addEventListener('drop', (event) => {
            event.preventDefault();
            const data = event.dataTransfer.getData('text/plain');
            if (data === 'Soap') {
                this.dropZone1.innerHTML = '';
                this.dropZone1.appendChild(document.createTextNode('Soap'));
            } else {
                alert('Wrong item dropped in zone!');
            }
        });

        this.dropZone2.addEventListener('drop', (event) => {
            event.preventDefault();
            const data = event.dataTransfer.getData('text/plain');
            if (data === 'Insomnia') {
                this.dropZone2.innerHTML = '';
                this.dropZone2.appendChild(document.createTextNode('Insomnia'));
            } else {
                alert('Wrong item dropped in zone!');
            }
        });

        this.dropZone3.addEventListener('drop', (event) => {
            event.preventDefault();
            const data = event.dataTransfer.getData('text/plain');
            if (data === 'Project Mayhem') {
                this.dropZone3.innerHTML = '';
                this.dropZone3.appendChild(document.createTextNode('Project Mayhem'));
            } else {
                alert('Wrong item dropped in zone!');
            }
        });

        const submitButton = document.querySelector('#submit-button');
        submitButton.addEventListener('click', () => {
            const dropZone1Text = this.dropZone1.textContent.trim();
            const dropZone2Text = this.dropZone2.textContent.trim();
            const dropZone3Text = this.dropZone3.textContent.trim();

            if (dropZone1Text === 'Soap' && dropZone2Text === 'Insomnia' && dropZone3Text === 'Project Mayhem') {
                if (soap.value && insomnia.value && projectMayhem.value) {

                } else {
                    $.ajax({
                        type: 'POST',
                        url: "/attempts",
                        contentType: "application/json",
                        dataType: 'json'
                    });
                    setStep({step:4});
                    // alert('Please fill all the input fields!');
                }
            } else {
                $.ajax({
                    type: 'POST',
                    url: "/deadEnds/",
                    contentType: "application/json",
                    dataType: 'json'
                });
                setStep({step:5});
                alert('Incorrect answer!');
            }
        });

    }
}

const soap = document.getElementById("Soap");
const insomnia = document.getElementById("Insomnia");
const projectMayhem = document.getElementById("proMayhem");
const submitButton = document.getElementById("submit-button");


function validateInputs() {
    if (soap.value && insomnia.value && projectMayhem.value) {
        submitButton.disabled = false;
    } else {
        submitButton.disabled = true;
    }
}

soap.addEventListener("input", validateInputs);
insomnia.addEventListener("input", validateInputs);
projectMayhem.addEventListener("input", validateInputs);

submitButton.addEventListener("click", function () {
    if (soap.value && insomnia.value && projectMayhem.value) {
        $.ajax({
            type: 'POST',
            url: "/deadEnds/",
            contentType: "application/json",
            dataType: 'json'
        });
        setStep({step:5});
    }
});

// const drag


const dragAndDrop = new DragAndDrop('.drop-zone-1', '.drop-zone-2', '.drop-zone-3', '.text-box', '.drag-drop-container');
