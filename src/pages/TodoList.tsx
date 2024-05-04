// list of cards
// card: lines of texts (define what i'm gonna do), checkbox to mark as done, delete button
// I'm able to add new cards
// I'm able to delete cards
// I'm able to mark cards as done with the checkbox

import { useState } from "react"

// add for multiple days?

interface CardType extends CardData{
  // Card methods
  onDelete(selectedId: string): void
  onDone(selectedId: string): void
}

interface CardData {
  id: string
  text: string
  isDone: boolean
}
const Card: React.FC<CardType> = ({ id, text, onDelete, onDone, isDone }) => {
  //TODO: if isDone, add line-through to text
  return(
    <>
    <div className="flex items-center">
      <input type="checkbox" onChange={() => {onDone(id)}}/>
      <p className={isDone ? "line-through" : ""}>{text}</p>
      <button onClick={() => {onDelete(id)}}>Delete</button>
    </div>
    {/* card */}
    </>
  )
}
const TodoList: React.FC = () => {

  const [cards, setCards] = useState<CardData[]>([])
  const [task, setTask] = useState<string>("")
  const addCard = () => {
    if (task) {
      setCards([...cards, {id: crypto.randomUUID(),text: task, isDone: false}])
      setTask("")
    }
  }

  const deleteCard = (selectedId: string): void => {
    setCards(cards.filter(({ id }) => id !== selectedId))
  }

  const markDone = (selectedId: string): void => {
    setCards(cards.map((card) => card.id === selectedId ? {...card, isDone: !card.isDone} : card))
  }
  return(
    <>
    {/* add new card */}
    <label>Task</label>
    <input type="text" value={task} onChange={(event) => setTask(event.target.value)}/>
    <button onClick={addCard}>Add</button>
    {/* list of cards */}
    {cards.map(({ id, text, isDone }) => {
      return <Card key={id} id={id} text={text} isDone={isDone} onDelete={deleteCard} onDone={markDone}/>
    })}
    </>
  )
}

export default TodoList