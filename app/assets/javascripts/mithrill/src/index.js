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
  app.state = loading;
  m.redraw();
  const data = new FormData(ev.target.parentNode);
  m.startComputation();
  request.post("/upload")
    .send(data)
    .end((err, res) => {
      console.log(res);
      app.imgUrl = `/show/${res.body.id}`
      m.endComputation();
    })
}
app.imgUrl = null;
const loading = "loading";
const done = "done";
app.state = done;
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

const imgView = (imgUrl, ctrl, state) => {
  let formParam = {
    method: "post",
    encType: "multipart/form-data"
  };
  if(imgUrl) {
    const tweetUrl = window.location.href + imgUrl.slice(1, imgUrl.length)
    const tweetText = window.location.href+" であけおめ画像"
    return (
      [
      m("img",{src: imgUrl}),
      m("h2","よいお年を"),
      m("a",{href: `https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`},"tweet")
      ]
    )
  } else {
    switch (state) {
      case loading:
        const bar = {
          class: "progress-bar progress-bar-striped active",
          role: "progressbar",
          style: "width: 100%"
        }
        return (
          m("div",{class: "progress"}, m("div", bar))
        )
      case done:
        return (
          [
            m("p","画像をupするとあけおめ入りにするよ（たぶん）"),
            m("form",formParam,[
              m("input", {class: "form-group",type: "file", name: makeRand(), encType: "multipart/form-data"}),
              m("input", {class: "btn btn-default",type: "button", value: "送信", onclick: ctrl.submit})
            ])
          ]
        )
    }
  }
}

app.view = (ctrl) => {
  let component = imgView(app.imgUrl, ctrl, app.state);
  console.log(app.state)
  return m("div",
  [component]
  )
}

m.mount(document.getElementById("app"), app);
