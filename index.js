let lib = 'https://gutendex.com/books';
let fetcher = (page = 1, url = `${lib}?page=${page}&mime_type=image`) => {
    fetch(url)
      .then(resp => resp.json())
      .then(obj => {
        ulSetter(obj.results);
        buttonToggle();
      });
  };
  
