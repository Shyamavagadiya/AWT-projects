//create react project for gst calculator


const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;
//middleware to convert in json
app.use(express.json());
//fetch the data
app.get("/", async (req, res) => {
  var data = readData();
  res.send(data);
});
//add todo
app.post("/", (req, res) => {
  const { title } = req.body;
  var data = readData();
  data = [...data, { id: Date.now(), title: title, isCompleted: false }];
  saveData(data);
  res.json(data);
});
//update based on id
app.put("/:id", (req, res) => {
  const id = req.params.id;
  const { title, isCompleted } = req.body;
  var data = readData();
  data = data.map((todo) =>
    todo.id == id ? { id, title, isCompleted } : todo
  );
  saveData(data);
  res.json(data);
});
//to read file
function readData() {
  var data = fs.readFileSync("data.json");
  if (data) return JSON.parse(data);
  else return [];
}
//create end point which will only toggle to complete status of all todos
app.get("/toggle",(req,res)=>{
    var data = readData();
    data = data.map((todo)=> [...todo, iscompleted])
})


//to save dato in file
function saveData(data) {
  fs.writeFileSync("data.json", JSON.stringify(data));
}
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
