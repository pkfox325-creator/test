// 논문 목록. 최신 것을 위에 추가하세요 (자동으로 연도순 정렬도 됩니다).
// type: "journal" | "conference" | "patent"
// authors 에서 교수/본인 이름을 PI_NAME 과 똑같이 적으면 자동으로 굵게 표시됩니다.
window.PI_NAME = "G. Hong";

window.PUBLICATIONS = [
  {
    type: "journal",
    year: 2026,
    title: "Title of the journal article goes here",
    authors: "A. Author, B. Author, G. Hong*",
    venue: "Journal Name",
    detail: "Vol. 00, 000000",
    link: "https://doi.org/10.0000/example",
  },
  {
    type: "journal",
    year: 2025,
    title: "Another journal article title",
    authors: "G. Hong, C. Author",
    venue: "Journal Name",
    detail: "Vol. 00, pp. 000–000",
    link: "",
  },
  {
    type: "conference",
    year: 2026,
    title: "Conference presentation title",
    authors: "B. Author, G. Hong",
    venue: "OOO Conference, Seoul, Korea",
    detail: "Oral",
    link: "",
  },
  {
    type: "patent",
    year: 2026,
    title: "특허 명칭",
    authors: "홍길동, 김철수",
    venue: "대한민국 특허 출원",
    detail: "10-2026-0000000",
    link: "",
  },
];
