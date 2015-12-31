const m = require("mithril");
const request = require("superagent");

let app = {};

const makeRand = () => {
  var l = 8;
  var c = "abcdefghijklmnopqrstuvwxyz0123456789";
  var cl = c.length;
  var r = "";
  for (var i = 0; i < l; i++) {
    r += c[Math.floor(Math.random() * cl)];
  }
  return r
}
app.imgUpload = (ev) => {
  m.startComputation();
  const data = new FormData(ev.target.parentNode);
  request.post("/upload")
    .send(data)
    .end((err, res) => {
      console.log(res);
      app.imgUrl = `/show/${res.body.id}`
      m.endComputation();
    })
}
app.imgUrl = null
app.controller = () => {
  let upImage = app.imgUpload;
  let imgUrl = app.imgUrl;
  return {
    imgUrl,
    submit(ev) {
      upImage(ev);
    }
  }
}

const imgView = (imgUrl, ctrl) => {
  let formParam = {
    method: "post",
    encType: "multipart/form-data"
  };
  if(imgUrl) {
    return m("img",{src: imgUrl})
  } else {
    return (
      m("form",formParam,[
      m("input", {type: "file", name: makeRand(), encType: "multipart/form-data"}),
      m("input", {type: "button", value: "送信", onclick: ctrl.submit})
    ])
  )
  }
}

app.view = (ctrl) => {
  let component = imgView(app.imgUrl, ctrl);
  return m("div",
  [m("p","あけおめ"),
  component]
  )
}

m.mount(document.getElementById("app"), app);
