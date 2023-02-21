import { NoteData, Tag } from './App';
import NoteForm from './NoteForm';
import { useNote } from './NoteLayout';

type EditNoteProps = {
  onSubmit: (id: string, data: NoteData) => void
  onAddTag: (tag: Tag) => void
  availableTags: Tag[]
}

export default function NewNote({ onSubmit, onAddTag,
availableTags }: EditNoteProps) {
  const note = useNote();

  return (
    <>
    <h1 className='mb-4'>Edit Note</h1>
    <NoteForm 
      title={note.title}
      markdown={note.markdown}
      tags={note.tags}
      onSubmit={data => onSubmit(note.id, data)} 
      onAddTag={onAddTag} 
      availableTags={availableTags} 
    />
    </>
  )
}

//here onSubmit we need to change formula to have an id which is a string; that means
//we cant directly pass it on our onSubmit. instead we need to take the data that this
//passes out to us, we need to call onSubmit which will have our id and data, and to
//get our note, we can get that from context

//to prefill our information on edit page: for that we need to pass in our title,
//markdown and tags 

//title={note.title} markdown={note.markdown} tags={note.tags} we dont have these
//inside our NoteForm, to have them: we can take our props and add in all of the 
//props for our note itself and this will be our NoteData