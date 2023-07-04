//Wrie the code here
document.addEventListener("DOMContentLoaded", () => {
  var list = document.getElementById("list");
  list.innerHTML = "<p>Waiting for the server...<p>";
   var prev = document.getElementById("prev");
  var next = document.getElementById("next");
  var whenSearch = document.getElementById("whenSearch");
  var listContainer = document.getElementById("list-container");
  var details = document.getElementById("details-container");
  var imgDivision = document.getElementById("cover-container");
  var buttonToggle = () => (list.innerHTML === "") ? (
    document.getElementById("prev").style = "visibility:hidden",
    document.getElementById("next").style = "visibility :hidden",
    list.innerHTML="<p>No Book found</p>"
  ) : (
    document.getElementById("prev").style = "visibility:visible",
    document.getElementById("next").style = "visibility :visible"
  );
  buttonToggle();
  var search = document.getElementById("search");
  var searched = document.getElementById("search-box");
  var pageNo = 1;
  var pages = 0;
  const mySet = new Set();
  const categories = document.getElementById("categories");
  searched.addEventListener("input", (e) => {
    detAndImgClear();
    search.textContent = "Refresh";
    whenSearch.style.display="block";
    finder(e.target.value);
  });

  // URL for the Gutendex API
  let APIUrl = "https://gutendex.com/books";

  const categoriesSetter = (obj) => {
    let eachBookCat = obj.map((el) => el.category);
    eachBookCat.forEach((el) => {
      el.forEach((ex) => mySet.add(ex));
    });
    mySet.forEach(el => {
      var category = document.createElement('option');
      category.textContent = el;
      categories.appendChild(category);
    });
    categories.addEventListener("change", (e) => {
      detAndImgClear();
      finder(e.target.value);
      searched.value = "";
    });
  };

  let buttonSetter = (pages, url) => {
    function nextPage() {
      if (pages >= pageNo) {
        ++pageNo;
        prev.disabled = false;
        fetcher(pageNo, url);
      }
      else {
        next.disabled = true;
      }
    }
    function prevPage() {
      if (pageNo > 1) {
        pageNo--;
        next.disabled = false;
        fetcher(pageNo, url);
      }
      else {
        prev.disabled = true;
      }
    }
    next.addEventListener("click", nextPage);
    prev.addEventListener("click", prevPage);
  };

  let pageSetter = () => {
    fetch(APIUrl)
      .then(resp => resp.json())
      .then(obj => {
        pages = Math.ceil(parseInt(obj.count) / 15);
        categoriesSetter(obj.results);
        fetcher();
        buttonSetter(pages, APIUrl);
      });
  };

  function detAndImgClear() {
    details.innerHTML = "";
    imgDivision.innerHTML = "";
  }

  let ulSetter = (obj) => {
    list.innerHTML = "";
    obj.forEach(element => {
      let bookLi = document.createElement('li');
      bookLi.textContent = element.title;
      bookLi.id = element.id;
      bookLi.style.transition = "none";
      list.appendChild(bookLi);
      bookLi.addEventListener("click", (e) => {
        whenSearch.style.display="none";
        fetch(`${apiUrl}/${e.target.id}`)
          .then(resp => resp.json())
          .then(obj => {
            imgDiv.style.transition = "all 0.1s";
            detAndImgClear();
            listContainer.style = liClicked;
            details.style = detailsClicked;
            imgDivision.style = imgDivClicked;
            const title = document.createElement('h2');
            let author = document.createElement('h3');
            var date = document.createElement('p');
            const cover = document.createElement('img');
            const link = document.createElement('a');
            link.href = obj.formats["text/html"];
            link.target = "_blank";
            link.textContent = "Read Online";
            title.textContent = obj.title;
            author.textContent = `Author: ${obj.authors.join(", ")}`;
            date.textContent = `Publication Date: ${obj.publication_date}`;
            cover.src = obj.formats["image/jpeg"] || obj.formats["image/png"] || obj.formats["image/gif"];
            cover.alt = obj.title;
            cover.width = "200";
            cover.height = "300";
            details.appendChild(title);
            details.appendChild(author);
            details.appendChild(date);
            details.appendChild(link);
            imgDivision.appendChild(cover);
          });
      });
    });
  };

  let fetcher = (pageNo = 1, url = APIUrl) => {
    fetch(`${url}?page=${pageNo}&mime_type=image`)
      .then(resp => resp.json())
      .then(obj => ulSetter(obj.results));
  };

  let finder = (query) => {
    if (query.length > 2) {
      fetch(`${APIUrl}?search=${query}&mime_type=image`)
        .then(resp => resp.json())
        .then(obj => ulSetter(obj.results));
    }
    else if (query.length === 0) {
      fetcher();
    }
  };

  pageSetter();

});
  
