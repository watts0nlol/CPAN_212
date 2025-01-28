import express from "express";

const router = express.Router();
// checking if in route
router.get("/", (req, res) => {
  res.send("Wcome to the lab router!");
});
// name
router.get("/name", (req, res) => {
  res.send("Alex Watson");
});
// greeting
router.get("/greeting", (req, res) => {
  res.send("Hello from Alex, Student Number: N01624210");
});
//add
router.get("/add/:x/:y", (req, res) => {
  // Convert x and y to numbers
  let x = parseFloat(req.params.x);
  let y = parseFloat(req.params.y);
  res.send(`${x + y}`);
});
//calculate
router.get("/calculate/:a/:b/:operation", (req, res) => {
  let a = parseFloat(req.params.a);
  let b = parseFloat(req.params.b);
  let operation = req.params.operation;
  let result;

  switch (operation) {
    case "+":
      result = a + b;
      break;

    case "-":
      result = a - b;
      break;

    case "*":
      result = a * b;
      break;

    case "/":
      result = a / b;
      if (b == 0){
        res.send("Cannot divide by 0")
        break;
      }
      break;

    case "**":
        result = a ** b;
        break;
  
    default:
      res.send("Invalid Operator");
      return;
  }

  res.send(`${result}`);
});

export default router;