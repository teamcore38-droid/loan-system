import os
import pypdf
import google.generativeai as genai
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS

# Load local .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Check if Gemini API key is configured
gemini_api_key = os.environ.get("GEMINI_API_KEY")
gemini_enabled = False

if gemini_api_key:
    genai.configure(api_key=gemini_api_key)
    gemini_enabled = True
    print("[AI SERVICE] Gemini API key detected. Using Gemini Multimodal for verification.")
else:
    print("[AI SERVICE] WARNING: GEMINI_API_KEY environment variable not found. Falling back to local keyword text-matching.")

def extract_text_from_pdf(file_stream):
    try:
        reader = pypdf.PdfReader(file_stream)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text
    except Exception as e:
        print("Error reading PDF:", e)
        return ""

def verify_file_with_gemini(file, customer_name, loan_type):
    try:
        file.seek(0)
        file_bytes = file.read()
        mime_type = file.mimetype
        
        # Resolve mime type if it is unknown
        if not mime_type or mime_type == 'application/octet-stream':
            ext = os.path.splitext(file.filename.lower())[1]
            if ext == '.pdf':
                mime_type = 'application/pdf'
            elif ext in ['.png', '.jpg', '.jpeg']:
                mime_type = f'image/{ext[1:]}'
                if mime_type == 'image/jpg':
                    mime_type = 'image/jpeg'

        prompt = f"""
Analyze the attached document for a loan restructuring request validation.
Customer Details:
- Target Customer Name: {customer_name}
- Target Loan Type: {loan_type}

Please verify the following:
1. Does the document belong to the customer (does it mention the customer name "{customer_name}" or a very similar match)?
2. What type of document is this? Categorize it into one of: "Request Letter", "CRIB Report", "Salary Slip", "Employer Confirmation", or "Unknown".
3. If it is a Request Letter: check if there is a signature, signature block, or indicator of signature.
4. If it is a Salary Slip: check if it displays basic/gross/net salary details.
5. If it is a CRIB Report: check if it includes credit facilities or payment arrears info.

Return a JSON response with exactly the following keys, and NO other text or formatting:
{{
  "documentType": "Request Letter" | "CRIB Report" | "Salary Slip" | "Employer Confirmation" | "Unknown",
  "nameMatch": true | false,
  "signatureDetected": true | false,
  "dataMatches": true | false,
  "confidenceScore": integer between 10 and 99
}}
Do not include any markdown styling like ```json. Return raw JSON text only.
"""

        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content([
            {
                'mime_type': mime_type,
                'data': file_bytes
            },
            prompt
        ])
        
        text = response.text.strip()
        # Clean up code blocks markdown if returned
        if text.startswith("```"):
            lines = text.split("\n")
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines[-1].startswith("```"):
                lines = lines[:-1]
            text = "\n".join(lines).strip()
            
        import json
        data = json.loads(text)
        return data
    except Exception as e:
        print(f"Gemini API verification error for {file.filename}: {e}")
        return None

@app.route('/api/verify', methods=['POST'])
def verify_documents():
    try:
        # Check if files were uploaded
        if not request.files:
            return jsonify({
                "success": False,
                "error": "No files uploaded for verification"
            }), 400

        # Retrieve loan/case metadata sent with upload
        customer_name = request.form.get("customerName", "").strip().lower()
        loan_type = request.form.get("loanType", "").strip().lower()
        expected_emi = request.form.get("currentEMI", "")
        dpd = request.form.get("dpd", "")

        results = {
            "completeness": True,
            "formatValid": True,
            "signatureDetected": True,
            "dataMatches": True,
            "dateConsistency": True,
            "duplicateCheck": True,
            "cribReportMissing": False,
            "confidenceScore": 99
        }

        uploaded_filenames = []
        all_files = []
        for key in request.files:
            file_list = request.files.getlist(key)
            for file in file_list:
                all_files.append(file)

        gemini_scores = []

        for file in all_files:
            filename = file.filename.lower()
            uploaded_filenames.append(filename)

            # 1. Format Valid check (Only PDF, JPG, PNG, JPEG)
            file_ext = os.path.splitext(filename)[1]
            if file_ext not in ['.pdf', '.jpg', '.jpeg', '.png']:
                results["formatValid"] = False
                results["confidenceScore"] -= 15

            # 2. Verification Processing
            if gemini_enabled:
                print(f"[AI SERVICE] Scanning {file.filename} with Gemini API...")
                gemini_res = verify_file_with_gemini(file, customer_name, loan_type)
                if gemini_res:
                    print(f"[AI SERVICE] Gemini response for {file.filename}: {gemini_res}")
                    # Update parameters based on Gemini findings
                    if not gemini_res.get("nameMatch", True):
                        results["dataMatches"] = False
                        results["confidenceScore"] -= 10
                    if gemini_res.get("documentType") == "Request Letter" and not gemini_res.get("signatureDetected", True):
                        results["signatureDetected"] = False
                        results["confidenceScore"] -= 10
                    if not gemini_res.get("dataMatches", True):
                        results["dataMatches"] = False
                        results["confidenceScore"] -= 10
                    gemini_scores.append(gemini_res.get("confidenceScore", 90))
                    continue

            # Fallback to local parsing
            print(f"[AI SERVICE] Scanning {file.filename} with local keyword parser...")
            text_content = ""
            if file_ext == '.pdf':
                file.seek(0)
                text_content = extract_text_from_pdf(file).lower()

            # Check for customer name matching in the content
            if customer_name and text_content:
                parts = customer_name.split()
                name_matched = all(part in text_content for part in parts)
                if not name_matched:
                    results["dataMatches"] = False
                    results["confidenceScore"] -= 10

            if "request" in filename or "letter" in filename:
                if text_content:
                    signature_indicators = ["sincerely", "regards", "thank you", "yours", "signature", "signed"]
                    has_sig = any(ind in text_content for ind in signature_indicators)
                    if not has_sig:
                        results["signatureDetected"] = False
                        results["confidenceScore"] -= 10

                    letter_keywords = ["request", "restructure", "difficulty", "pay", "installments", "tenure"]
                    has_kw = any(kw in text_content for kw in letter_keywords)
                    if not has_kw:
                        results["dataMatches"] = False
                        results["confidenceScore"] -= 10

            elif "salary" in filename or "slip" in filename:
                if text_content:
                    salary_keywords = ["salary", "slip", "earnings", "basic", "net", "gross", "pay", "allowance"]
                    has_kw = any(kw in text_content for kw in salary_keywords)
                    if not has_kw:
                        results["dataMatches"] = False
                        results["confidenceScore"] -= 10

            elif "crib" in filename:
                if text_content:
                    crib_keywords = ["crib", "credit", "bureau", "arrears", "report", "facility", "facilities"]
                    has_kw = any(kw in text_content for kw in crib_keywords)
                    if not has_kw:
                        results["dataMatches"] = False
                        results["confidenceScore"] -= 10

        # 3. Completeness check
        has_letter = any("request" in fn or "letter" in fn for fn in uploaded_filenames)
        has_salary = any("salary" in fn or "slip" in fn for fn in uploaded_filenames)
        has_crib = any("crib" in fn for fn in uploaded_filenames)

        if not has_letter or not has_salary:
            results["completeness"] = False
            results["confidenceScore"] -= 20

        if not has_crib:
            results["cribReportMissing"] = True
            results["confidenceScore"] -= 15

        # Factor in Gemini specific scores if any succeeded
        if gemini_enabled and gemini_scores:
            results["confidenceScore"] = int(sum(gemini_scores) / len(gemini_scores))
            # Subtract penalties for missing required documents/format errors
            if not results["completeness"]:
                results["confidenceScore"] -= 20
            if results["cribReportMissing"]:
                results["confidenceScore"] -= 15
            if not results["formatValid"]:
                results["confidenceScore"] -= 15

        # Limit score bounds
        results["confidenceScore"] = max(10, min(99, results["confidenceScore"]))

        return jsonify({
            "success": True,
            "caseId": request.form.get("caseId", "CF-NEW"),
            "verificationResults": results
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "Healthy", "module": "AI Verification Service"})

if __name__ == '__main__':
    # Run server on port 5000
    app.run(host='0.0.0.0', port=5000, debug=True)
