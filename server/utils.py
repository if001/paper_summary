import pypdfium2 as pdfium


def pdf2text(pdf_bytes):
    pdf = pdfium.PdfDocument(pdf_bytes)

    text = ""
    for page in pdf:
        textpage = page.get_textpage()
        text += textpage.get_text_range()
    return text


def main():
    text = pdf2text(open("./phi3.pdf", encoding="utf-8").read())
    print(text)


if __name__ == "__main__":
    main()
