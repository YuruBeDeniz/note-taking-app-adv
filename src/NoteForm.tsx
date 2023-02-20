import { FormEvent, useRef, useState } from 'react';
import { Form, Stack, Row, Col, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import CreatableReactSelect from "react-select/creatable";
import { NoteData, Tag } from './App';
import { v4 as uuidV4 } from "uuid";

type NoteFormProps = {
    onSubmit: (data: NoteData) => void
    onAddTag: (tag: Tag) => void
    availableTags: Tag[]
}

export default function NoteForm({ onSubmit, onAddTag, availableTags }: NoteFormProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const markdownRef = useRef<HTMLTextAreaElement>(null);
  const [selectedTags, setSelectedTags] =  useState<Tag[]>([]);
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    //we put ! here as we make sure that in Form.Control they are "required" so they will never be null.
    onSubmit({
        title: titleRef.current!.value,
        markdown: markdownRef.current!.value,
        tags: selectedTags,
    });

    navigate("..");
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Stack gap={4}>
        <Row>
          <Col>
            <Form.Group controlId='title'>
              <Form.Label>Title</Form.Label>
              <Form.Control ref={titleRef} required />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId='tags'>
              <Form.Label>Tags</Form.Label>
              <CreatableReactSelect 
                onCreateOption={label => {
                  const newTag = { id: uuidV4(), label };
                  onAddTag(newTag);
                  setSelectedTags(prev => [...prev, newTag]);
                }}
                value={selectedTags.map(tag => {
                  return { label: tag.label, value: tag.id }
                })}
                options={availableTags.map(tag => {
                  return { label: tag.label, value: tag.id }
                })} 
                onChange={tags => {
                  setSelectedTags(tags.map(tag => {
                    return { label: tag.label, id: tag.value }
                  })) 
                }}
                isMulti />
            </Form.Group>
          </Col>
        </Row>  
         <Form.Group controlId='markdown'>
           <Form.Label>Body</Form.Label>
           <Form.Control ref={markdownRef} required as="textarea" rows={15} />
         </Form.Group>
         <Stack direction='horizontal' gap={2} className="justify-content-end">
            <Button type='submit' variant='primary'>
                Save
            </Button>
            <Link to="..">
            <Button type='button' variant="outline-secondary">
                Cancel
            </Button>
            </Link>
         </Stack>
      </Stack>
    </Form>
  )
}

//in CreatableReactSelect's value: selectedTags we need to pass an array that has
//keys for label and for value. For that, we need to take our selected tags and map it
//to a brand new value; { label: tag.label, value: tag.id } The reason for this,
//creatableReactSelect expects a label and an id for its value
//and in onChange function we're converting from the value the creatableReactSelect expects
//to the value that we're actually storing for our type which is an id and a label


//onCreateOption (funtion takes in "label") on CreatableReactSelect --> we need to 
//automatically sent the value because it doesn't call onChange function (which is
// in the same CreatableReactSelect tag) when we create a new tag. Instead, it calls
//this onCreateOption function.
//why do we have onAddTag(newTag) is we want to make sure that we can store that info
//inside our localStogare: const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);
//so we need to handle a function for that