import os
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

os.makedirs("sample_docs/fake", exist_ok=True)

def create_pdf(filename, title, paragraphs):
    path = os.path.join("sample_docs/fake", filename)
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
    print(f"Created fake/{filename}")

# 1. Fake CRIB (Wrong Name - belongs to John Doe instead of Amara Wijesinghe)
create_pdf(
    "fake_crib_wrong_name.pdf",
    "Credit Information Bureau (CRIB) Report",
    [
        "Date: 11 Jun 2026",
        "Credit Information Report",
        "Subject Details:",
        "Name: John Doe",
        "NIC Number: 771234567V",
        "Credit Facility Summary:",
        "Active Facilities: 2 Credit Cards, 1 Personal Loan",
        "Outstanding Balance: LKR 1.20Mn",
        "Arrears Days: 90 Days",
        "Status: Under Watchlist"
    ]
)

# 2. Fake CRIB (Missing Credit/Bureau Data - just random text)
create_pdf(
    "fake_crib_no_bureau_data.pdf",
    "Company Internal Memo Document",
    [
        "Date: 14 Jun 2026",
        "To: All Staff Members",
        "From: HR Department",
        "Subject: Office dress code updates",
        "This is to remind all staff that business casual dress is allowed on Fridays.",
        "Please ensure company dress code policies are respected at all times.",
        "Regards,",
        "HR Operations Manager"
    ]
)

print("FAKE CRIB SAMPLE DOCUMENTS GENERATED.")
