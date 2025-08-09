(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

//tax toggle
let taxSwitch = document.getElementById("switchCheckReverse");
let taxSwitchMobile = document.getElementById("switchCheckReverseMobile");

function toggleTaxInfo(checked) {
  let taxinfo = document.getElementsByClassName("tax-info");
  for (let info of taxinfo) {
    if (checked) {
      info.style.display = "inline";
    } else {
      info.style.display = "none";
    }
  }
}

if (taxSwitch) {
  taxSwitch.addEventListener("change", () => {
    toggleTaxInfo(taxSwitch.checked);
  });
}

if (taxSwitchMobile) {
  taxSwitchMobile.addEventListener("change", () => {
    toggleTaxInfo(taxSwitchMobile.checked);
    // Sync with desktop toggle if both exist
    if (taxSwitch) {
      taxSwitch.checked = taxSwitchMobile.checked;
    }
  });
}

// Sync desktop toggle with mobile if both exist
if (taxSwitch && taxSwitchMobile) {
  taxSwitch.addEventListener("change", () => {
    taxSwitchMobile.checked = taxSwitch.checked;
  });
}