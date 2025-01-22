// var a = 10;
// let v = 20;
// const c = 30;
//
// console.log(v + "+" + a + "=" + (c + v));
// console.log(`${a} + ${c} = ${a + c}`);

var students = [
    {
        id: 1,
        name: "Jay",
        city: "Rajkot",
        age: 14,
    },
    {
        id: 2,
        name: "Jay",
        city: "Rajkot",
        age: 14,
    },
    {
        id: 3,
        name: "Vijay",
        city: "Morbi",
        age: 10,
    },
    {
        id: 4,
        name: "Ajay",
        city: "Rajkot",
        age: 12,
    },
    {
        id: 5,
        name: "Raj",
        city: "Jamnagar",
        age: 12,
    },
];
const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => res.json(students));
app.get("/student/city/:city", (req, res) => {
    var stud_city = req.params.city;
    var student = students.filter((s) => s.city == stud_city);
    res.json(student);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
