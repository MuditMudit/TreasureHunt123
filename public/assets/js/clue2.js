function checkAnswer() {
    const selectedOption = document.querySelector('input[name="options"]:checked');
    if (!selectedOption) {
        document.getElementById("error-msg").textContent = "Please select an option";
        setTimeout(function () {
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger'
                },
                buttonsStyling: false
            });

            swalWithBootstrapButtons.fire({
                title: 'no answer selected?',
                text: "Answer",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Talk about what',
                cancelButtonText: 'Okay going to Answer',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    setStep({step:3});
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithBootstrapButtons.fire(
                        'Okay',
                        'Okay go on',
                        'success'
                    );
                }
            });
        }, 7000);
        return;
    } else {
        document.getElementById("error-msg").textContent = "";
        const selectedOptionId = selectedOption.getAttribute('id');
        if (selectedOptionId === 'option2') {
            document.getElementById("clue3-link").classList.remove('hidden');
            document.getElementById("submit-btn").classList.add('hidden');
            document.getElementById("clear-btn").classList.add('hidden');
            document.getElementById("error-msg").textContent = "You got it! Click the button to go to the next clue.";
            $.ajax({
                type: 'POST',
                url: "/deadEnds/",
                contentType: "application/json",
                dataType: 'json'
            });
            setStep({step:5});
        } else {
            document.getElementById("error-msg").textContent = "Sorry, that's not correct. Please try again.";
        }
    }
}

document.getElementById("clear-btn").addEventListener("click", function () {
    const selectedOption = document.querySelector('input[name="options"]:checked');
    if (selectedOption) {
        selectedOption.checked = false;
    }
});
