const express = require('express');
const Note = require('../models/Note');
const router = express.Router();
const fetchuser = require('../Middleware/fetchuser');
const { body, validationResult } = require('express-validator');

// ROUTE 1: Get all the notes using :Get "/api/notes/fetchallnotes". login require
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

})

// ROUTE 2: Add a new note using :post "/api/notes/addnote". login require
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'description must be atleast 5 characters').isLength({ min: 5 }),

], async (req, res) => {

    try {

        const { title, description, tag } = req.body;
        // if there are errors return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const saveNote = await note.save();
        res.json(saveNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 3: Update an existing note using :Put "/api/notes/updatenote". login require
router.put('/updatenote/:id', fetchuser, async (req, res) => {

    const { title, description, tag } = req.body;
    try {

        // create a newnote object
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        // Find the note to be updated and update it

        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found ");
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

})


// ROUTE 4: Delete an existing note using :Delete "/api/notes/deletenote". login require
router.delete('/deletenote/:id', fetchuser, async (req, res) => {

    try {

        // Find the note to be deleted and delete it

        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found ");
        }
        // Allow deletion if user owns this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted", note: note });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


module.exports = router