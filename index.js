const express = require("express");
const app = express();
const fs = require("fs");
const multer = require("multer");
const upload = multer();


app.use(express.static("static"));
app.use(express.json());
app.use(upload.any());
app.use(express.text());


const port = 8000;
app.listen(port, () => {
  console.log("Server is running on http://localhost:" + port);
})


function noteExists(noteName, array) {
  return array.some((obj) => obj["name"] == noteName);
}


app.get("/UploadForm.html", (req, res) => {
  res.sendFile(__dirname + '/static/UploadForm.html');
})


app.get("/notes", (req, res) => {
  if (!fs.existsSync("notes.json")) {
    fs.writeFileSync("notes.json", "[]");
  }

  res
    .status(200)
    .sendFile("notes.json", { root: __dirname });
});


app.post("/upload", (req, res) => {
  let noteName = req.body.note_name;
  let noteBody = req.body.note;
  let notes = JSON.parse(fs.readFileSync("notes.json"));

  if (noteExists(noteName, notes)) {
    res
      .status(400)
      .send("400: Bad request, Note already exists.");
    return
  }

  notes.push({ name: noteName, body: noteBody });
  let updatedNotes = JSON.stringify(notes);
  fs.writeFileSync("notes.json", updatedNotes);

  res
    .status(201)
    .send("201: Note was succesfully created");
    return
});


app.get("/notes/:name", (req, res) => {
  let notes = JSON.parse(fs.readFileSync("notes.json"));
  let noteName = req.params.name;

  if (!noteExists(noteName, notes)) {
    res
      .status(404)
      .send("404: Note with this name was not found.");
    return
  }

  const note = notes.find((obj) => obj["name"] == noteName);

  res
    .status(200)
    .send(note["body"]);
  return
});


app.put("/notes/:name", (req, res) => {
  let notes = JSON.parse(fs.readFileSync("notes.json"));
  let noteName = req.params.name;
  let newNoteBody = req.body;

  if (!noteExists(noteName, notes)) {
    res
      .status(404)
      .send("404: Note with this name was not found.");
    return
  }

  const note = notes.find((obj) => obj["name"] == noteName);

  note["body"] = newNoteBody;
  updatedNotes = JSON.stringify(notes);

  fs.writeFileSync("notes.json", updatedNotes);

  res
    .status(200)
    .send("200: Success: Note was changed.");
  return
});


app.delete("/notes/:name", (req, res) => {
  let notes = JSON.parse(fs.readFileSync("notes.json"));
  let noteName = req.params.name;

  if (!noteExists(noteName, notes)) {
    res
      .status(404)
      .send("404: Note with this name was not found.");
    return
  }

  let note = notes.find((obj) => obj["name"] == noteName);

  let updatedNotes = JSON.stringify(
    notes.filter((obj) => obj["name"] != note["name"])
  );

  fs.writeFileSync("notes.json", updatedNotes);

  res
    .status(200)
    .send("200: Success: Note was deleted");
  return
});
