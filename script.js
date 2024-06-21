// We will write our JavaScript code here

var resetBtn = document.querySelector("#reset");
var saveBtn = document.querySelector("#save");
var uploadBtn = document.querySelector("#upload");
var fileInput = document.querySelector("#file-input");

var selectedFilter = document.querySelector("#selected-filter");
var value = document.querySelector("#value");
var slider = document.querySelector("#slider");
var mainImage = document.querySelector("#main-image");

var filterButtons = document.querySelectorAll(".filter-button");
var rotateButtons = document.querySelectorAll(".rotate-button");

var brightness = 100;
var saturation = 100;
var inversion = 0;
var grayscale = 0;

var rotate = 0;
var flipX = 1;
var flipY = 1;

uploadBtn.addEventListener("click", function () {
  fileInput.click();
});

fileInput.addEventListener("change", function () {
  var file = fileInput.files[0];
  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    mainImage.src = reader.result;
    document.querySelector(".container").classList.remove("disable");
  };
});

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    selectedFilter.innerText = button.innerText;
    document.querySelector(".filter-button.active").classList.remove("active");
    button.classList.add("active");
    var selection = button.id;
    if (selection === "brightness") {
      value.innerText = brightness + "%";
      slider.value = brightness;
      slider.max = 200;
    } else if (selection === "saturation") {
      value.innerText = saturation + "%";
      slider.value = saturation;
      slider.max = 200;
    } else if (selection === "inversion") {
      value.innerText = inversion + "%";
      slider.value = inversion;
      slider.max = 100;
    } else if (selection === "grayscale") {
      value.innerText = grayscale + "%";
      slider.value = grayscale;
      slider.max = 100;
    }
  });
});

function applyFilters() {
  mainImage.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
  mainImage.style.transform = `rotate(${rotate}deg) scale(${flipX},${flipY})`;
}

slider.addEventListener("input", function () {
  var selection = document.querySelector(".filter-button.active").id;
  if (selection === "brightness") {
    brightness = slider.value;
    value.innerText = brightness + "%";
  } else if (selection === "saturation") {
    saturation = slider.value;
    value.innerText = saturation + "%";
  } else if (selection === "inversion") {
    inversion = slider.value;
    value.innerText = inversion + "%";
  } else if (selection === "grayscale") {
    grayscale = slider.value;
    value.innerText = grayscale + "%";
  }
  applyFilters();
});

rotateButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    var selection = button.id;
    if (selection === "rotate-left") {
      rotate -= 90;
    } else if (selection === "rotate-right") {
      rotate += 90;
    } else if (selection === "flip-x") {
      flipX *= -1;
    } else if (selection === "flip-y") {
      flipY *= -1;
    }
    applyFilters();
  });
});

resetBtn.addEventListener("click", function () {
  brightness = 100;
  saturation = 100;
  inversion = 0;
  grayscale = 0;
  rotate = 0;
  flipX = 1;
  flipY = 1;
  applyFilters();

  selectedFilter.innerText = "Brightness";
  value.innerText = "100%";
  slider.value = 100;
  slider.max = 200;
  document.querySelector(".filter-button.active").classList.remove("active");
  document.querySelector("#brightness").classList.add("active");
});

saveBtn.addEventListener("click", function () {
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");

  var img = new Image();
  img.src = mainImage.src;
  img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.filter = mainImage.style.filter;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotate * Math.PI) / 180);
    ctx.scale(flipX, flipY);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);

    var link = document.createElement("a");
    link.download = "image.png";
    link.href = canvas.toDataURL();
    link.click();
  };
});
