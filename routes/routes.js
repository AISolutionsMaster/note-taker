const fs = require('fs');
const path = require('path');

module.exports = app => {

    // Setup notes variable
    fs.readFile("db/db.json","utf8", (err, data) => {

        if (err) throw err;

        var notes = JSON.parse(data);

        // API ROUTES
        // ========================================================
    
        // Setup the /api/notes get route
        app.get("/api/notes", function(req, res) {
            // Read the db.json file and return all saved notes as JSON.
            res.json(notes);
        });

        // Setup the /api/notes post route
        app.post("/api/notes", function(req, res) {
            // Receives a new note, adds it to db.json, then returns the new note
            let newNote = req.body;
            notes.push(newNote);
            updateDb();
            return console.log("Added new note: "+newNote.title);
        });

        // Retrieves a note with specific id
        app.get("/api/notes/:id", function(req,res) {
            // display json for the notes array indices of the provided id
            res.json(notes[req.params.id]);
        });

        // Deletes a note with specific id
        app.delete("/api/notes/:id", function(req, res) {
            notes.splice(req.params.id, 1);
            updateDb();
            console.log("Deleted note with id "+req.params.id);
        });

        // VIEW ROUTES
        // ========================================================

        // Display notes.html when /notes is accessed
        app.get('/notes', function(req, res) {
            // Get the directory of the current file (__dirname)
            const directoryPath = __dirname; 
          
            // Read the contents of the directory
            fs.readdir(directoryPath, function (err, files) {
              if (err) {
                return console.log('Unable to scan directory: ' + err);
              } 
          
              // List all files in the directory
              files.forEach(function (file) {
                console.log(file); 
              });
          
              // Continue serving your notes.html file
              console.log(path.join(__dirname, "./notes.html"));
              res.sendFile(path.join(__dirname, "./notes.html"));
            });
          });
        


        // Display index.html when all other routes are accessed
        app.get('*', function(req,res) {
            res.sendFile(path.join(__dirname, "./index.html"));
        });

        //updates the json file whenever a note is added or deleted
        function updateDb() {
            fs.writeFile("db/db.json",JSON.stringify(notes,'\t'),err => {
                if (err) throw err;
                return true;
            });
        }

    });

}