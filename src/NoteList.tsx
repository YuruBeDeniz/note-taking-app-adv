import { useMemo, useState } from 'react';
import { Row, Col, Stack, Button, Form, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ReactSelect from "react-select";
import { Tag } from './App';
import styles from "./NoteList.module.css";

type SimplifiedNote = {
    tags: Tag[]
    title: string
    id: string
}

type NoteListProps = {
    availableTags: Tag[]
    notes: SimplifiedNote[]
}

export default function NoteList({ availableTags, notes }: NoteListProps) {
  const [selectedTags, setSelectedTags] =  useState<Tag[]>([]);
  const [title, setTitle] = useState("");

  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
        return (title === "" || note.title.toLocaleLowerCase().includes(title.toLocaleLowerCase()))
        && (selectedTags.length === 0 || 
            selectedTags.every(tag => note.tags.some(noteTag => noteTag.id === tag.id)))
    })
  }, [title, selectedTags, notes])

  return (
    <>
    <Row className='align-items-center mb-4'>
      <Col>
        <h1>Notes</h1>
      </Col>
      <Col xs="auto">
        <Stack gap={2} direction="horizontal">
          <Link to="/new">
            <Button variant='primary'>Create</Button>
          </Link>
          <Button variant='outline-secondary'>Edit Tags</Button>
        </Stack>
      </Col>
    </Row>
    <Form>
      <Row className='mb-4'>
        <Col>
          <Form.Group controlId='title'>
            <Form.Label>Title</Form.Label>
            <Form.Control type='text' value={title} onChange={e => setTitle(e.target.value)}/>
          </Form.Group>
        </Col>
        <Col>
        <Form.Group controlId='tags'>
              <Form.Label>Tags</Form.Label>
              <ReactSelect
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
    </Form>
    <Row xs={1} sm={2} lg={3} xl={4} className="g-3" >
      {filteredNotes.map(note => (
        <Col key={note.id}>
          <NoteCard id={note.id} title={note.title} tags={note.tags} />
        </Col>
      ))}
    </Row>
    </>
  )
}

function NoteCard({ id, title, tags }: SimplifiedNote) {
    return (
      <Card 
        as={Link} 
        to={`/${id}`} 
        className={`h-100 text-reset text-decoration-none ${styles.card}`} 
      >
        <Card.Body>
          <Stack 
            gap={2} 
            className="align-items-center justify-content-center h-100"
          >
            <span className='fs-5'>{title}</span>
          </Stack>
          {tags.length > 0 && (
            <Stack
              gap={1}
              direction="horizontal"
              className="justify-content-center flex-wrap"
            >
              {tags.map(tag => (
                <Badge className="text-truncate" key={tag.id}>
                  {tag.label}
                </Badge>
              ))}
            </Stack>
          )}
        </Card.Body>
      </Card>
    )
  }

//since we've hooked up the onChange and our value for ReactSelect tag, we should
//do the same thing for our value for our title

// selectedTags.every(tag => note.tags.some(noteTag => noteTag.id === tag.id))) 
//here we make sure every single one of those tags will be a tag that's inside of
// note.tags. so we can check our note tags to see if some of them include this
//exact tag -->
//i.e. loop through all our selectedTags and make sure every single one of them 
//returns true for this statement: note.tags.some(noteTag => noteTag.id === tag.id)
//and this statement says: check our note to see if it contains the tag we are
//looping through.
//so: selectedTags.every(tag => note.tags.some(noteTag => noteTag.id === tag.id)))
//this code is checking to make sure our note has all of the tags that we're searching for 