
let formFields = [
  {
    "checked": true,
    "description": "This is your public display name",
    "disabled": false,
    "name": "Username",
    "placeholder": "shadcn",
    "required": true,
    "type": "text",
    "rowIndex": 0,
    "value": "",
    "variant": "Input"
  },
  {
    "label": "Age",
    "name": "age",
    "placeholder": "Enter your age",
    "required": true,
    "rowIndex": 1,
    "type": "number",
    "value": 18,
    "variant": "Input"
  },
  {
    "label": "Agree to terms",
    "name": "terms_001",
    "checked": false,
    "required": true,
    "rowIndex": 2,
    "type": "checkbox",
    "variant": "Checkbox"
  }
]

export default function handler(req, res) {
  if (req.method === "GET") {
    res.status(200).json(formFields);
  } else if (req.method === "POST") {
    const updatedFields = req.body;

    formFields = updatedFields;
    res.status(200).json({ message: "Form updated successfully!" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}