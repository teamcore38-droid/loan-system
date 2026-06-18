import os
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

os.makedirs("sample_docs/legit", exist_ok=True)
os.makedirs("sample_docs/fake", exist_ok=True)

def create_pdf(filename, folder, title, paragraphs):
    path = os.path.join("sample_docs", folder, filename)
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
    print(f"Created {folder}/{filename}")

# 1. Legit Request Letter (Amara Wijesinghe)
create_pdf(
    "legit_amara_request.pdf",
    "legit",
    "Loan Restructuring Request Letter",
    [
        "Date: 15 Jun 2026",
        "To:\nRemedial Review Manager\nCreditFlow Solutions",
        "Dear Remedial Manager,",
        "I am writing to request a restructuring of my personal loan (Account No: LA-2024-008912) due to a recent salary reduction at my company.",
        "Currently, my monthly payment is LKR 40,000, which is no longer manageable. I would like to request reducing my monthly payment to LKR 24,000 and extending the tenure by 12 months.",
        "Thank you for considering my request.",
        "Sincerely,",
        "Amara Wijesinghe\n(Signed)"
    ]
)

# 2. Legit Salary Slip (Amara Wijesinghe)
create_pdf(
    "legit_amara_salary.pdf",
    "legit",
    "Bank of Ceylon - Monthly Salary Slip",
    [
        "Salary Statement for the Month of May 2026",
        "Employee Details:\nName: Amara Wijesinghe\nEmployee ID: EMP-40112\nDesignation: Senior Officer",
        "Earnings:\nBasic Salary: LKR 110,000\nAllowances: LKR 30,000\nGross Salary: LKR 140,000",
        "Deductions:\nEPF/ETF Contribution: LKR 14,000\nTax Withheld: LKR 14,000\nTotal Deductions: LKR 28,000",
        "Net Payable Salary: LKR 112,000",
        "Status: Paid (Bank Transfer)"
    ]
)

# 3. Legit CRIB Report (Amara Wijesinghe)
create_pdf(
    "legit_amara_crib.pdf",
    "legit",
    "Credit Information Bureau (CRIB) Report",
    [
        "Date: 11 Jun 2026",
        "Credit Information Report",
        "Subject Details:\nName: Amara Wijesinghe\nNIC Number: 852938192V",
        "Credit Facility Summary:\nActive Facilities: 1 Personal Loan\nOutstanding Balance: LKR 2.84Mn\nArrears: 45 Days",
        "Status: Performing (Restructuring Requested)"
    ]
)

# 4. Fake Request Letter (Wrong Name for Amara Wijesinghe case)
create_pdf(
    "fake_wrong_name_amara_request.pdf",
    "fake",
    "Loan Restructuring Request Letter",
    [
        "Date: 15 Jun 2026",
        "To:\nRemedial Review Manager\nCreditFlow Solutions",
        "Dear Remedial Manager,",
        "I am writing to request a restructuring of my personal loan (Account No: LA-2024-008912) due to a recent salary reduction at my company.",
        "Currently, my monthly payment is LKR 40,000, which is no longer manageable. I would like to request reducing my monthly payment to LKR 24,000 and extending the tenure by 12 months.",
        "Thank you for considering my request.",
        "Sincerely,",
        "John Doe\n(Signed)"
    ]
)

# 5. Fake Salary Slip (Wrong Name for Amara Wijesinghe case)
create_pdf(
    "fake_wrong_name_amara_salary.pdf",
    "fake",
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

print("AMARA WIJESINGHE SAMPLE DOCUMENTS GENERATED.")
