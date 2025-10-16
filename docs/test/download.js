console.log("Hello from download.js");

// https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByTagName


//fetch('https://download.osmand.net/indexes.xml')
//fetch('http://localhost:63342/poople/maps/indexes.xml')
fetch('https://proxy.bazurl.com/key/28622BD18959556B19E33AAA3B164ECA')
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.text();
  })
  .then((data) => {
    doc = new window.DOMParser().parseFromString(data, "text/xml")
    elements = doc.getElementsByTagName('region')

    the_dict = {}
    the_dict["Maps"] = {}

    for (const el of elements) {
        if (el.getAttribute("type") != "map") {
            continue
        }
        r_name = el.getAttribute("name")
        tokens = r_name.split('_')
        if (tokens.length < 3) {
            continue
        }

        item = {"__download__": {
            "url": r_name,
            "date": el.getAttribute("date"),
            "size": el.getAttribute("size"),
            "description": el.getAttribute("description")
        }}
        switch (tokens.length) {
            case 3:
                [country, continent, _] = tokens
                if (!(continent in the_dict["Maps"])) {
                    the_dict["Maps"][continent] = {}
                }
                the_dict["Maps"][continent][country] = item
                break
            case 4:
                [country, region, continent, _] = tokens
                if (!(continent in the_dict["Maps"])) {
                    the_dict["Maps"][continent] = {}
                }
                if (!(country in the_dict["Maps"][continent])) {
                    the_dict["Maps"][continent][country] = {}
                }
                the_dict["Maps"][continent][country][region] = item
                break
            case 5:
                [country, state, region, continent, _] = tokens
                if (!(continent in the_dict["Maps"])) {
                    the_dict["Maps"][continent] = {}
                }
                if (!(country in the_dict["Maps"][continent])) {
                    the_dict["Maps"][continent][country] = {}
                }
                if (!(state in the_dict["Maps"][continent][country])) {
                    the_dict["Maps"][continent][country][state] = {}
                }
                the_dict["Maps"][continent][country][state][region] = item
                break
            default:
                console.log("Unexpected number of tokens:", tokens.length, tokens)
        }
    }

    console.log(JSON.stringify(the_dict, null, " "));
  })
  .catch((error) => {
    console.error('Fetch error:', error);
  });