var inputSiteName = document.getElementById("bookmarkName");
      var inputSiteURL = document.getElementById("bookmarkURL");
      var buttonSubmit = document.getElementById("submitBtn");
      var tableBody = document.getElementById("tableContent");
      var buttonsDelete;
      var buttonsVisit;
      var buttonClose = document.getElementById("closeBtn");
      var modalBox = document.querySelector(".modal-overlay");
      var listOfBookmarks = [];

      if (localStorage.getItem("bookmarksList")) {
        listOfBookmarks = JSON.parse(localStorage.getItem("bookmarksList"));
        for (var x = 0; x < listOfBookmarks.length; x++) {
          displayBookmark(x);
        }
      }

      function displayBookmark(index) {
        var userURL = listOfBookmarks[index].siteURL;
        var httpsRegex = /^https?:\/\//g;
        if (httpsRegex.test(userURL)) {
          validURL = userURL;
          fixedURL = validURL.split("").splice(validURL.match(httpsRegex)[0].length).join("");
        } else {
          var fixedURL = userURL;
          validURL = `https://${userURL}`;
        }
        var newBookmark = `
          <tr>
            <td>${index + 1}</td>
            <td>${listOfBookmarks[index].siteName}</td>              
            <td>
             

 <button class="btn btn-visit" data-index="${index}">
                <i class="fa-solid fa-eye pe-2"></i>Visit
              </button>
            </td>
            <td>
              <button class="btn btn-delete pe-2" data-index="${index}">
                <i class="fa-solid fa-trash-can"></i>
                Delete
              </button>
            </td>
          </tr>
        `;
        tableBody.innerHTML += newBookmark;

        buttonsDelete = document.querySelectorAll(".btn-delete");
        if (buttonsDelete) {
          for (var j = 0; j < buttonsDelete.length; j++) {
            buttonsDelete[j].addEventListener("click", function (e) {
              deleteBookmark(e);
            });
          }
        }

        buttonsVisit = document.querySelectorAll(".btn-visit");
        if (buttonsVisit) {
          for (var l = 0; l < buttonsVisit.length; l++) {
            buttonsVisit[l].addEventListener("click", function (e) {
              visitWebsite(e);
            });
          }
        }
      }

      function clearInputFields() {
        inputSiteName.value = "";
        inputSiteURL.value = "";
      }

      function capitalizeString(str) {
        let strArr = str.split("");
        strArr[0] = strArr[0].toUpperCase();
        return strArr.join("");
      }

      buttonSubmit.addEventListener("click", function () {
        if (inputSiteName.classList.contains("is-valid") && inputSiteURL.classList.contains("is-valid")) {
          var bookmark = {
            siteName: capitalizeString(inputSiteName.value),
            siteURL: inputSiteURL.value,
          };
          listOfBookmarks.push(bookmark);
          localStorage.setItem("bookmarksList", JSON.stringify(listOfBookmarks));
          displayBookmark(listOfBookmarks.length - 1);
          clearInputFields();
          inputSiteName.classList.remove("is-valid");
          inputSiteURL.classList.remove("is-valid");
        } else {
          modalBox.classList.remove("d-none");
        }
      });

      function deleteBookmark(e) {
        tableBody.innerHTML = "";
        var indexToDelete = e.target.dataset.index;
        listOfBookmarks.splice(indexToDelete, 1);
        for (var k = 0; k < listOfBookmarks.length; k++) {
          displayBookmark(k);
        }
        localStorage.setItem("bookmarksList", JSON.stringify(listOfBookmarks));
      }

      function visitWebsite(e) {
        var indexToVisit = e.target.dataset.index;
        var httpsRegex = /^https?:\/\//;
        if (httpsRegex.test(listOfBookmarks[indexToVisit].siteURL)) {
          open(listOfBookmarks[indexToVisit].siteURL);
        } else {
          open(`https://${listOfBookmarks[indexToVisit].siteURL}`);
        }
      }

      var namePattern = /^\w{3,}(\s+\w+)*$/;
      var urlPattern = /^(https?:\/\/)?(w{3}\.)?\w+\.\w{2,}\/?(:\d{2,5})?(\/\w+)*$/;

      inputSiteName.addEventListener("input", function () {
        validateInput(inputSiteName, namePattern);
      });

      inputSiteURL.addEventListener("input", function () {
        validateInput(inputSiteURL, urlPattern);
      });

      function validateInput(element, pattern) {
        var testPattern = pattern;
        if (testPattern.test(element.value)) {
          element.classList.add("is-valid");
          element.classList.remove("is-invalid");
        } else {
          element.classList.add("is-invalid");
          element.classList.remove("is-valid");
        }
      }

      function closeModal() {
        modalBox.classList.add("d-none");
      }

      buttonClose.addEventListener("click", closeModal);

      document.addEventListener("keydown", function (e) {
        if (e.key == "Escape") {
          closeModal();
        }
      });

      document.addEventListener("click", function (e) {
        if (e.target.classList.contains("modal-overlay")) {
          closeModal();
        }
      });