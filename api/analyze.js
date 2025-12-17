export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "只支持 POST 请求" });
  }

  const { imageBase64 } = req.body;
  if (!imageBase64) return res.status(400).json({ error: "请上传图片" });

  try {
    // ---- 模拟分析图片 ----
    const subjects = ["单人女性", "双人对峙", "猫咪", "狗狗", "建筑"];
    const scenes = ["夜晚室内", "雨天街头", "阳光公园", "咖啡厅", "海边"];
    const styles = ["写实", "影视感", "卡通风", "复古风", "商业海报"];
    const colors = ["低饱和灰色", "高饱和红黑", "明亮温暖色", "冷蓝色调", "柔和粉色"];
    const compositions = ["特写", "中景", "远景", "俯视", "平视"];
    const lightings = ["自然光", "单侧光", "柔光", "高对比光影"];

    function pick(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }

    const mockResult = {
      subject: pick(subjects),
      scene: pick(scenes),
      style: pick(styles),
      color: pick(colors),
      composition: pick(compositions),
      lighting: pick(lightings),
      details: "背景简洁，人物清晰，画面干净"
    };

    const resultText = `【主体内容】
${mockResult.subject}

【场景设定】
${mockResult.scene}

【整体风格】
${mockResult.style}

【色调与色彩】
${mockResult.color}

【构图与视角】
${mockResult.composition}

【光影与质感】
${mockResult.lighting}

【细节补充】
${mockResult.details}`;

    await new Promise(resolve => setTimeout(resolve, 300));
    res.status(200).json({ result: resultText });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "服务器内部错误" });
  }
}
