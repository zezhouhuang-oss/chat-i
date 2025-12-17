export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4mb", // 防止 413
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: "No image provided" });
    }

    // 去掉 data:image/...;base64,
    const base64 = imageBase64.split(",")[1];
    const buffer = Buffer.from(base64, "base64");

    // Hugging Face BLIP 图像描述模型
    const response = await fetch(
      "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/octet-stream",
        },
        body: buffer,
      }
    );

    const result = await response.json();

    if (!Array.isArray(result) || !result[0]?.generated_text) {
      return res.status(500).json({ error: "Model failed", detail: result });
    }

    const caption = result[0].generated_text;

    // 👉 把“描述”整理成提示词结构
    const prompt = `
主体内容：
${caption}

风格建议：
cinematic lighting, high quality, sharp focus

构图：
close-up or medium shot, strong subject focus

色彩：
balanced tones, commercial poster style
`.trim();

    res.status(200).json({ prompt });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
