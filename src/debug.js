export const printSlotElement = (slots) => {
  if (slots instanceof Array) slots.forEach((el, id) => console.log(id, el.elm))
  else console.log(slots)
}
