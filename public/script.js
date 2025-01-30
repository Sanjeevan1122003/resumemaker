function typeText(element, text, time) {
    let index = 0;
    function type() {
        if (index < text.length) {
            element.textContent = text.slice(0, index + 1) + "|";
            index++;
            setTimeout(type, time);
        } else {
            element.textContent = text;
        }
    }
    type();
}
const tittleEl = document.getElementById("tittle");
typeText(tittleEl, "Resume Maker", 300);

function toggleDropdown(id) {
    $(".dashboard-menu-items-item-dropdown").not("#" + id).removeClass("active");
    $("#" + id).toggleClass("active");
}

document.addEventListener("DOMContentLoaded", function () {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('pdfFile');

    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('dragover', event => {
        event.preventDefault();
        dropZone.style.borderColor = "blue";
    });
    dropZone.addEventListener('dragleave', () => dropZone.style.borderColor = "#ccc");
    dropZone.addEventListener('drop', event => {
        event.preventDefault();
        dropZone.style.borderColor = "#ccc";
        const file = event.dataTransfer.files[0];
        if (file) handleFile(file);
    });

    fileInput.addEventListener('change', event => {
        const file = event.target.files[0];
        if (file) handleFile(file);
    });

    function handleFile(file) {
        console.log("File selected:", file.name);
        dropZone.textContent = `Selected: ${file.name}`;
        dropZone.style.border = "solid #ffffff";
        dropZone.style.color = "#ffffff";

    }
});



const blinkElement = document.getElementById('blink');
let dots = 0;

setInterval(() => {
    dots = (dots + 1) % 4;
    blinkElement.textContent = '.'.repeat(dots);
}, 500); 


let num = 1;

function loadAndTick() {
    setTimeout(() =>{
    document.getElementById("load" + num).style.display = "block";
    setTimeout(() => {
        document.getElementById("tick" + num).classList.add("checked");
        num++; 
        setTimeout(loadAndTick, 1000); 
    }, 2000);
}, 1000);
if(num > 4){
    document.getElementById("getStartedBtn").style.display = "block";
}
}

loadAndTick();

let sections = document.querySelectorAll('[id^="section"]');

if (sections.length > 1) {
  let sectionOne = sections[0];
  sections.forEach((section) => {
    if (section != sectionOne) {
      $(section).css("display", "none");
    }
  });
}

const display = (sectionId) => {
  makeRemainingScreensInvisible(sectionId);
  let section = document.getElementById(sectionId);
  $(section).css("display", "block");
  window.scrollTo(0, 0);
};

const makeRemainingScreensInvisible = (sectionId) => {
  let sections = document.querySelectorAll('[id^="section"]');
  sections.forEach((section) => {
    if ($(section).attr("id") != sectionId) {
      $(section).css("display", "none");
    }
  });
};