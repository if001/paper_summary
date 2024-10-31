import os
import requests
from flask import Flask, request, jsonify
import google.generativeai as genai
from google.generativeai import GenerationConfig
from dotenv import load_dotenv

from utils import pdf2text

app = Flask(__name__)
app.json.ensure_ascii = False

dotenv_path = os.path.join(os.getcwd(), ".env")
load_dotenv(dotenv_path)
GEMINI_API_KEY = os.environ["API_KEY"]


def get_prompt(text):
    return (
        "論文の内容を参照し以下のフォーマットで出力してください。\n"
        "## どんなもの\n"
        "## 先行研究と比べてどこがすごいの？\n"
        "## 技術や手法のきもはどこにある？\n"
        "## どうやって有効だと検証した？\n"
        "## 議論はあるか\n"
        "## 次に読むべき論文はあるか？\n"
        "\n\n"
        f"{text}"
    )


genai.configure(api_key=GEMINI_API_KEY)
config = GenerationConfig(
    max_output_tokens=128, temperature=0.4, top_p=1, top_k=32, candidate_count=1
)
safety_settings = [
    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
]


@app.route("/summarize", methods=["POST"])
def summarize():
    """
    PDF ファイルを受け取り、Gemini API を使用して要約を生成する
    """

    # リクエストから PDF ファイルを取得
    pdf_file = request.files.get("pdf_file")
    if not pdf_file:
        return jsonify({"error": "PDF file is required."}), 400

    model_name = "models/gemini-1.5-pro"
    model_name = "models/gemini-1.5-flash"
    model = genai.GenerativeModel(model_name)

    try:
        pdf_text = pdf2text(pdf_file)
        pdf_text = pdf_text[:200]
        print("---")
    except Exception as e:
        print("pdf parse error", e)
        return jsonify({"error": "pdf parse error"}), 500

    prompt = get_prompt(pdf_text)

    try:
        response = model.generate_content(
            prompt, generation_config=config, safety_settings=safety_settings
        )
    except Exception as e:
        print("generate error", e)
        return jsonify({"error": "gen error"}), 500

    # print(response)
    summary = response.text
    return jsonify({"summary": summary}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
