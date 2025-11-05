function renderImages(list) {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";

  list.forEach((url, index) => {
    const imgBox = document.createElement("div");
    imgBox.className = "img-box";

    imgBox.innerHTML = `
      <img src="${url}" class="thumb" />
      <div class="img-link">
        <a href="${url}" target="_blank">Ảnh ${index + 1}</a>
      </div>
    `;

    gallery.appendChild(imgBox);
  });
}

chrome.storage.local.get("imageLinks", (data) => {
  const list = data.imageLinks || [];
  renderImages(list);

  document.getElementById("downloadAll").onclick = async () => {
    if (list.length === 0) {
      alert("Không có ảnh nào được tìm thấy.");
      return;
    }

    const zip = new JSZip();
    const folder = zip.folder("scribd_images");

    for (let i = 0; i < list.length; i++) {
      const url = list[i];
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        folder.file(`image_${i+1}.jpg`, blob);
      } catch (err) {
        console.error("Lỗi tải ảnh:", url);
      }
    }

    const content = await zip.generateAsync({ type: "blob" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(content);
    a.download = "scribd_images.zip";
    a.click();
  };
});
