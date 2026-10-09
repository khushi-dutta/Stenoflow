"""Generate the original, dependency-free StenoFlow study PDFs.

Run `python scripts/generate_resources.py` after editing the guide copy below.
The output is deterministic and can be committed with the site.
"""

from pathlib import Path
import textwrap


GUIDES = {
    "first-week": (
        "YOUR FIRST WEEK OF DELIBERATE PRACTICE",
        "A short, repeatable routine for accurate transcription.",
        [
            ("DAY 1  |  Baseline", "Choose an easy passage. Type for one minute at a comfortable pace. Record your speed and accuracy. This is a starting point, not a judgment."),
            ("DAY 2  |  Rhythm", "Warm up on familiar keys for five minutes. Keep your shoulders relaxed and return your fingers to their home position after every reach."),
            ("DAY 3  |  Review", "Pick five words from yesterday's mistakes. Write each once slowly, then use each in a short sentence. Repeat the passage and compare results."),
            ("DAY 4  |  Listening", "Listen to a short passage before typing. Identify the topic and sentence boundaries. Replay once, transcribe, and mark words you could not hear clearly."),
            ("DAY 5  |  Detail", "Practice punctuation, capitalization, and names. Review the meaning of each sentence before making a correction."),
            ("DAY 6  |  Timed practice", "Choose a short timed session. Finish the passage before reviewing. Note the words that interrupted your flow."),
            ("DAY 7  |  Reflect", "Compare today's speed and accuracy with Day 1. Pick one skill to focus on next week. Consistent practice matters more than rushing."),
        ],
    ),
    "transcription": (
        "A CALMER APPROACH TO TRANSCRIPTION",
        "A practical routine before, during, and after practice.",
        [
            ("BEFORE YOU START", "Read the instructions and check the time limit. Test audio volume and playback controls. Sit comfortably, with relaxed shoulders and neutral wrists."),
            ("LISTEN FOR STRUCTURE", "Notice the main topic and where sentences end. If a word is unclear, keep moving. A missed word should not cost the rest of the sentence."),
            ("TRANSCRIBE WITH CONTROL", "Work at a pace you can maintain. Preserve names, numbers, and meaning. Leave a temporary marker for an uncertain word only if your practice rules allow it."),
            ("REVIEW IN PASSES", "First look for omissions and repeated words. Then check spelling, punctuation, and capitalization. Use the reference passage to learn from differences."),
            ("MEASURE USEFULLY", "Track speed and accuracy together. Review the specific types of errors you made and repeat one short exercise before increasing pace."),
            ("PRACTICE NOTE", "These are general practice suggestions, not official examination instructions. Check the current notice for the exact rules of your test."),
        ],
    ),
    "vocabulary": (
        "ADMINISTRATIVE VOCABULARY PRACTICE",
        "Recall common words accurately before increasing speed.",
        [
            ("WORD SET A", "administration, appointment, application, committee, communication, correspondence, department, development"),
            ("WORD SET B", "government, information, notification, opportunity, recommendation, regulation, responsibility, verification"),
            ("EXERCISE 1  |  Clean repetition", "Type each word three times. Pause after an error, compare the correct spelling, and type it once more with full attention."),
            ("EXERCISE 2  |  Recall", "Hide the word set. Write down as many words as you remember. Check spelling and repeat only the words you missed."),
            ("EXERCISE 3  |  Context", "Write a short sentence using administration, correspondence, recommendation, and verification. Read each sentence aloud before typing it again."),
            ("EXERCISE 4  |  Timed review", "After the words feel familiar, type the two sets for one minute. Compare accuracy first, then speed. Try again after a short break."),
        ],
    ),
}


def escape(value: str) -> str:
    return value.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


def pdf_for(title: str, subtitle: str, sections: list[tuple[str, str]]) -> bytes:
    # US Letter, Helvetica; split after three sections for generous spacing.
    pages = []
    groups = [sections[:3], sections[3:]]
    for number, group in enumerate(groups, 1):
        commands = ["0.11 0.18 0.30 rg", "52 745 508 3 re f", "BT /F2 12 Tf 52 710 Td (STENOFLOW  /  FIELD NOTES) Tj ET"]
        y = 668
        for line in textwrap.wrap(title, 39):
            commands.append(f"BT /F2 20 Tf 52 {y} Td ({escape(line)}) Tj ET")
            y -= 25
        commands.extend(["0.27 0.36 0.50 rg", f"BT /F1 11 Tf 52 {y-7} Td ({escape(subtitle)}) Tj ET", "0.11 0.18 0.30 rg"])
        y -= 63
        for heading, body in group:
            commands.append(f"BT /F2 12 Tf 52 {y} Td ({escape(heading)}) Tj ET")
            y -= 23
            for line in textwrap.wrap(body, 84):
                commands.append(f"BT /F1 10 Tf 52 {y} Td ({escape(line)}) Tj ET")
                y -= 16
            y -= 29
        commands.extend(["0.27 0.36 0.50 rg", f"BT /F1 9 Tf 52 42 Td (Original study material  |  StenoFlow  |  Page {number} of 2) Tj ET"])
        pages.append("\n".join(commands).encode("ascii"))

    objects: list[bytes] = [b"<< /Type /Catalog /Pages 2 0 R >>", b"<< /Type /Pages /Count 2 /Kids [3 0 R 4 0 R] >>"]
    for index in range(2):
        objects.append(f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents {7+index} 0 R >>".encode())
    objects.extend([b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>", b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>"])
    for page in pages:
        objects.append(f"<< /Length {len(page)} >>\nstream\n".encode() + page + b"\nendstream")
    output = bytearray(b"%PDF-1.4\n")
    offsets = [0]
    for index, value in enumerate(objects, 1):
        offsets.append(len(output))
        output.extend(f"{index} 0 obj\n".encode() + value + b"\nendobj\n")
    start = len(output)
    output.extend(f"xref\n0 {len(objects)+1}\n0000000000 65535 f \n".encode())
    for offset in offsets[1:]:
        output.extend(f"{offset:010d} 00000 n \n".encode())
    output.extend(f"trailer\n<< /Size {len(objects)+1} /Root 1 0 R >>\nstartxref\n{start}\n%%EOF\n".encode())
    return bytes(output)


if __name__ == "__main__":
    target = Path(__file__).resolve().parents[1] / "public" / "resources"
    target.mkdir(parents=True, exist_ok=True)
    for slug, (title, subtitle, sections) in GUIDES.items():
        path = target / f"{slug}.pdf"
        path.write_bytes(pdf_for(title, subtitle, sections))
        print(path)
