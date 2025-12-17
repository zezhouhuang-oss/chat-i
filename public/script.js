const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const generateBtn = document.getElementById("generateBtn");
const result = document.getElementById("result");

let uploadedImage = null;

imageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    preview.src = reader.result;
    uploadedImage = reader.result;
    result.textContent = "";
  };
  reader.readAsDataURL(file);
});

generateBtn.addEventListener("click", async () => {
  if (!uploadedImage) {
    alert("请先上传图片");
    return;
  }

  result.textContent = "生成中...";

  try {
    const res = await fetch("/api/analyze.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageBase64: uploadedImage })
    });
    const data = await res.json();
    if (data.result) {
      result.textContent = data.result;
    } else {
      result.textContent = "生成失败";
    }
  } catch (e) {
    result.textContent = "请求失败";
    console.error(e);
  }
});
