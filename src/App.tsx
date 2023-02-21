import "bootstrap/dist/css/bootstrap.min.css";
import { useMemo, useState } from "react";
import { Container } from "react-bootstrap";
import { Routes, Route, Navigate } from "react-router-dom";
import NewNote from "./NewNote";
import { useLocalStorage } from "./useLocalStorage";
import { v4 as uuidV4 } from "uuid";  
import NoteList from "./NoteList";
import NoteLayout from "./NoteLayout";
import Note from "./Note";
import EditNote from "./EditNote";

export type Note = {
  id: string
} & NoteData

export type NoteData = {
  title: string
  markdown: string
  tags: Tag[]
}

export type Tag = {
  id: string
  label: string
}

export type RawNote = {
  id: string
} & RawNoteData

export type RawNoteData = {
  title: string
  markdown: string
  tagIds: string[]
}

 
function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", []);
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);

  const notesWithTags = useMemo(() => {
    return notes.map(note => {
      return { ...note, tags: tags.filter(tag => note.tagIds.includes(tag.id)) }
    })
  }, [notes, tags]);

  function onCreateNote ({ tags, ...data }: NoteData) {
    setNotes(prevNotes => {
      return [
        ...prevNotes,
        { ...data, id: uuidV4(), tagIds: tags.map(tag => tag.id) }]
    })
  };

  function onUpdateNote(id: string, { tags, ...data }: NoteData) {
    setNotes(prevNotes => {
      return prevNotes.map(note => {
        if (note.id === id) {
          return { ...note, ...data, tagIds: tags.map(tag => tag.id) };
        } else {
          return note;
        }
      })
    })
  };

  function onDeleteNote (id: string) {
    setNotes(prevNotes => {
      return prevNotes.filter(note => note.id !==id);
    })
  }

  function addTag(tag: Tag) {
    setTags(prev => [...prev, tag]);
  };

  function updateTag(id: string, label: string) {
    setTags(prevTags => {
      return prevTags.map(tag => {
        if(tag.id === id) {
          return {...tag, label }
        } else {
          return tag;
        }
      })
    })
  };

  function deleteTag(id: string) {
    setTags(prevTags => {
      return prevTags.filter(tag => tag.id !==id);
    })
  }
  
  return (
    <Container className="my-4">
      <Routes>
        <Route path="/" element={
          <NoteList 
            notes={notesWithTags} 
            availableTags={tags}
            onUpdateTag={updateTag}
            onDeleteTag={deleteTag} />} 
        />
        <Route path="/new" element={
          <NewNote 
            onSubmit={onCreateNote} 
            onAddTag={addTag}
            availableTags={tags} />} 
        />
        <Route path="/:id" element={
          <NoteLayout 
            notes={notesWithTags} />} 
        >
          <Route index element={<Note onDelete={onDeleteNote} />} />
          <Route path="edit" element={
            <EditNote
             onSubmit={onUpdateNote} 
             onAddTag={addTag}
             availableTags={tags} />} 
          />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  )
}

export default App



//we need to store some data through useLocalStorage as we want keep this info persisted
//RawNote type will use tag id as we dont need to go through every single note type
//and update that value if only the value of our tags is changed. we'll just update
//our tag which we're storing inside of localStorage as well and it'll automatically
//propagate that change because it knows that the id is the correct id


//useMemo --> loop through all my notes and for each one of them. i want you to keep
//all the info about the notes ({ ...note, }) but i also want you to get the tags that
//have the associated id inside of our note that's being stored:(not all the tags but
//only the tags selected for that particular note):
//tags: tags.filter(tag => note.tagIds.includes(tag.id)) }
//and we only run this every time when our notes or tags gets updated. , [notes, tags]) 


//function onCreateNote (data: NoteData) here data type is NoteData but we need to
//setNotes value to RawNoteData (bc of this: useLocalStorage<RawNote[]>) so we need to
//convert NoteData into RawNote. so instead of storing the tag itself, we just want to
//extract the id (as we have only tagIds in RawNote): tagIds: tags.map(tag => tag.id)
//onCreateNote ({ ...tags, ...data } --> we'll have our tags and all of the data for our note


//onUpdateNote function:  { ...note, ...data, tagIds: tags.map(tag => tag.id) }; here
//we're converting our tags to ids, saving all of our existing data (...note) and 
//overwriting with our new data (, ...data)


//onDeleteNote filter through all of our notes, check where the id is not equal to 
//the id we pass in: this will give us all the notes except the one that we want
//to delete based on this this id (the one we pass as parameter): yani bu id
//dışındaki diğer idleri filter ederek listemizi güncellemiş oluyoruz çünkü
//"filter() method constructs a new array of all the values for which
//callbackFn returns a truthy value"