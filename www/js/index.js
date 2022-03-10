document.addEventListener("init", function (event) {
  console.log("init called");
});

const loadPage = (page) => {
  document.querySelector("#menu").close();
  document
    .querySelector("#navigator")
    .bringPageTop(page, { animation: "fade" });
};

function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || "";
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, { type: contentType });
  return blob;
}

/**
 * Create a PDF file according to its database64 content only.
 *
 * @param folderpath {String} The folder where the file will be created
 * @param filename {String} The name of the file that will be created
 * @param content {Base64 String} Important : The content can't contain the following string (data:application/pdf;base64). Only the base64 string is expected.
 */
function savebase64AsPDF(folderpath, filename, content, contentType) {
  // Convert the base64 string in a Blob
  var DataBlob = b64toBlob(content, contentType);

  console.log("Starting to write the file :3");

  window.resolveLocalFileSystemURL(folderpath, function (dir) {
    console.log("Access to the directory granted succesfully");
    console.log(dir);
    dir.getFile(filename, { create: true }, function (file) {
      console.log("File created succesfully.");
      file.createWriter(
        function (fileWriter) {
          console.log("Writing content to file");
          fileWriter.write(DataBlob);
        },
        function () {
          console.log("Unable to save file in path " + folderpath);
        }
      );
    });
  });
}

ons.ready(async () => {
  if (ons.platform.isAndroid(true)) {
    setTimeout(() => {
      // check share via email option available or not if no hide all email related contents
      window.plugins.socialsharing.canShareViaEmail(
        (e) => console.log(e),
        (e) => {
          console.log("from error: share via email: ", e);
          document.querySelectorAll(".relatedToEmail").forEach((element) => {
            element.classList.add("hide");
          });
        },
        3000
      );
    });
  }
});

function copyToClipboard(text) {
  const input = document.querySelector(".copyArea");
  input.value = text;
  input.select();
  document.execCommand("copy");
}
