// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

//form validation for large file
let listingImgUpload = document.getElementById("image");
if(listingImgUpload ){
  listingImgUpload.addEventListener("change", function () {
      const file = this.files[0];

      if (file && file.size > 2 * 1024 * 1024) {
          alert("Image size must not exceed 2 MB.");
          this.value = ""; // Remove the selected file
      }
  });
}
