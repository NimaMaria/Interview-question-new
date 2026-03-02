import PyPDF2
import os

def extract_text_from_pdf(pdf_file):
    """
    Extracts text from a PDF file object or path.
    """
    try:
        reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            content = page.extract_text()
            if content:
                text += content + "\n"
        return text.strip()
    except Exception as e:
        print(f"Error extracting PDF: {e}")
        return None
