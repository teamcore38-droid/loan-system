import os
import subprocess
import sys

# Ensure reportlab is installed
try:
    import reportlab
except ImportError:
    print("Installing reportlab...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "reportlab"])

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

os.makedirs("sample_docs", exist_ok=True)

def create_pdf(filename, title, paragraphs):
    path = os.path.join("sample_docs", filename)
    c = canvas.Canvas(path, pagesize=letter)
    width, height = letter
    
    # Draw Title
    c.setFont("Helvetica-Bold", 16)
    c.drawString(72, height - 72, title)
    
    # Draw Line separator
    c.setStrokeColorRGB(0.5, 0.5, 0.5)
    c.setLineWidth(1)
    c.line(72, height - 85, width - 72, height - 85)
    
    # Draw Paragraphs
    c.setFont("Helvetica", 11)
    y = height - 120
    for para in paragraphs:
        lines = para.split("\n")
        for line in lines:
            if y < 72:
                c.showPage()
                c.setFont("Helvetica", 11)
                y = height - 72
            c.drawString(72, y, line)
            y -= 15
        y -= 10
        
    c.save()
    print(f"Created {filename}")

# 1. Legit Request Letter
create_pdf(
    "legit_nimal_request.pdf",
    "Loan Restructuring Request Letter",
    [
        "Date: 12 Jun 2026",
        "To:\nRemedial Review Manager\nCreditFlow Solutions",
        "Dear Remedial Manager,",
        "I am writing to request a restructuring of my personal loan (Account No: LA-2024-008912) due to a recent salary reduction at my company.",
        "Currently, my monthly payment is LKR 40,000, which is no longer manageable. I would like to request reducing my monthly payment to LKR 24,000 and extending the tenure by 12 months.",
        "Thank you for considering my request.",
        "Sincerely,",
        "Nimal Perera\n(Signed)"
    ]
)

# 2. Fake Request Letter (Wrong Name)
create_pdf(
    "fake_wrong_name_request.pdf",
    "Loan Restructuring Request Letter",
    [
        "Date: 12 Jun 2026",
        "To:\nRemedial Review Manager\nCreditFlow Solutions",
        "Dear Remedial Manager,",
        "I am writing to request a restructuring of my personal loan (Account No: LA-2024-008912) due to a recent salary reduction at my company.",
        "Currently, my monthly payment is LKR 40,000, which is no longer manageable. I would like to request reducing my monthly payment to LKR 24,000 and extending the tenure by 12 months.",
        "Thank you for considering my request.",
        "Sincerely,",
        "John Doe\n(Signed)"
    ]
)

# 3. Fake Request Letter (Unsigned)
create_pdf(
    "fake_unsigned_request.pdf",
    "Loan Restructuring Request Letter",
    [
        "Date: 12 Jun 2026",
        "To:\nRemedial Review Manager\nCreditFlow Solutions",
        "Dear Remedial Manager,",
        "I am writing to request a restructuring of my personal loan (Account No: LA-2024-008912) due to a recent salary reduction at my company.",
        "Currently, my monthly payment is LKR 40,000, which is no longer manageable. I would like to request reducing my monthly payment to LKR 24,000 and extending the tenure by 12 months.",
        "Thank you for considering my request."
    ]
)

# 4. Legit Salary Slip
create_pdf(
    "legit_nimal_salary.pdf",
    "Bank of Ceylon - Monthly Salary Slip",
    [
        "Salary Statement for the Month of May 2026",
        "Employee Details:\nName: Nimal Perera\nEmployee ID: EMP-90823\nDesignation: Senior Officer",
        "Earnings:\nBasic Salary: LKR 110,000\nAllowances: LKR 30,000\nGross Salary: LKR 140,000",
        "Deductions:\nEPF/ETF Contribution: LKR 14,000\nTax Withheld: LKR 14,000\nTotal Deductions: LKR 28,000",
        "Net Payable Salary: LKR 112,000",
        "Status: Paid (Bank Transfer)"
    ]
)

# 5. Fake Salary Slip (Wrong Name)
create_pdf(
    "fake_wrong_name_salary.pdf",
    "Bank of Ceylon - Monthly Salary Slip",
    [
        "Salary Statement for the Month of May 2026",
        "Employee Details:\nName: John Doe\nEmployee ID: EMP-11223\nDesignation: Senior Officer",
        "Earnings:\nBasic Salary: LKR 110,000\nAllowances: LKR 30,000\nGross Salary: LKR 140,000",
        "Deductions:\nEPF/ETF Contribution: LKR 14,000\nTax Withheld: LKR 14,000\nTotal Deductions: LKR 28,000",
        "Net Payable Salary: LKR 112,000",
        "Status: Paid (Bank Transfer)"
    ]
)

print("ALL SAMPLE DOCUMENTS GENERATED SUCCESSFULLY IN sample_docs/ FOLDER.")
