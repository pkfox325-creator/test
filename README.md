# 연구실 홈페이지 (GitHub Pages)

빌드 도구 없이 HTML/CSS/JS만으로 만든 정적 사이트입니다.
**내용은 `data/` 폴더의 파일만 고치면** 모든 페이지에 자동으로 반영됩니다.

## 폴더 구조

```
index.html          홈 (Hero · 소개 · 연구분야 · 최신소식 · 최근논문)
about.html          연구실 소개 + 교수 프로필
research.html       연구분야 상세 + 연구과제
members.html        구성원 + 졸업생
publications.html   논문/학회/특허 (필터 기능)
news.html           소식
contact.html        연락처 + 지도

data/
  lab.js            연구실 이름, 교수 정보, 주소/연락처   ← 제일 먼저 수정
  research.js       연구분야, 연구과제
  members.js        구성원, 졸업생
  publications.js   논문 목록
  news.js           소식

assets/css/style.css   디자인 (색상은 맨 위 :root 의 --primary, --accent)
assets/js/main.js      렌더링 스크립트 (보통 수정할 필요 없음)
assets/img/            사진 넣는 곳 (직접 만드세요)
serve.ps1              로컬 미리보기 서버
```

## 내용 수정하는 법

- **구성원 추가**: `data/members.js` 의 `MEMBERS` 배열에 `{ ... },` 블록 하나를 복사해서 붙이고 값만 바꾸세요.
- **사진 넣기**: `assets/img/members/kim.jpg` 처럼 넣고 `photo: "assets/img/members/kim.jpg"` 로 적으세요. 정사각형 사진을 권장합니다.
- **논문 추가**: `data/publications.js` 에 항목을 추가하세요. 연도별로 자동 정렬되고, `PI_NAME` 과 같은 저자명은 굵게 표시됩니다.
- **소식 추가**: `data/news.js` 맨 위에 추가하세요. 홈에는 최신 3개가 나옵니다.
- **메뉴 바꾸기**: `assets/js/main.js` 상단의 `NAV` 배열을 수정하세요.

> 주의: data 파일은 JavaScript 문법입니다. 문자열은 `"..."` 로 감싸고, 항목 사이에 쉼표(`,`)를 빠뜨리지 마세요.
> 화면이 비어 보이면 브라우저 F12 → Console 에서 오류 줄 번호를 확인하세요.

## 로컬에서 미리보기

`index.html` 을 더블클릭해도 대부분 보이지만, 정확히 확인하려면 이 폴더에서:

```bash
powershell -ExecutionPolicy Bypass -File serve.ps1
```

실행 후 브라우저에서 http://localhost:8000 을 여세요. (종료: Ctrl+C)

## GitHub Pages 배포

1. GitHub에서 새 저장소를 만듭니다.
   - 주소를 `https://<아이디>.github.io` 로 쓰려면 저장소 이름을 `<아이디>.github.io` 로,
   - 아니면 아무 이름(예: `lab`) → 주소는 `https://<아이디>.github.io/lab/`
2. 이 폴더의 파일을 전부 업로드합니다.
   - Git이 없으면: 저장소 페이지 → **Add file → Upload files** 로 폴더 내용을 끌어다 놓기
   - Git이 있으면:
     ```bash
     git init
     ```
     ```bash
     git add .
     ```
     ```bash
     git commit -m "Initial lab homepage"
     ```
     ```bash
     git branch -M main
     ```
     ```bash
     git remote add origin https://github.com/<아이디>/<저장소>.git
     ```
     ```bash
     git push -u origin main
     ```
3. 저장소 **Settings → Pages → Build and deployment** 에서
   Source: **Deploy from a branch**, Branch: **main / (root)** 선택 후 Save.
4. 1~2분 후 표시되는 주소로 접속하면 끝입니다.

### 개인 도메인 (선택)
`lab.example.ac.kr` 같은 주소를 쓰려면 Settings → Pages → Custom domain 에 입력하고,
학교 전산팀에 해당 주소의 CNAME 을 `<아이디>.github.io` 로 등록해 달라고 요청하세요.
